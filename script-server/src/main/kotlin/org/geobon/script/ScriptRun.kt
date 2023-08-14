package org.geobon.script

import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.*
import org.geobon.pipeline.RunContext
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.io.File
import java.io.IOException
import java.util.concurrent.TimeUnit
import java.util.concurrent.TimeoutException
import kotlin.time.Duration
import kotlin.time.Duration.Companion.hours
import kotlin.time.DurationUnit
import kotlin.time.ExperimentalTime
import kotlin.time.measureTime


class ScriptRun( // Constructor used in single script run
    private val scriptFile: File,
    private val context: RunContext,
    private val timeout: Duration = DEFAULT_TIMEOUT) {

    // Constructor used in pipelines & tests
    constructor(
        scriptFile: File,
        /** The JSON content of the input file */
        inputMap: Map<String, Any?>,
        timeout: Duration = DEFAULT_TIMEOUT
    ) : this(scriptFile, RunContext(scriptFile, inputMap), timeout)

    lateinit var results: Map<String, Any>
        private set

    val resultFile get() = context.resultFile

    private val logger: Logger = LoggerFactory.getLogger(scriptFile.name)
    private var logBuffer: String = ""
    private val logFile = File(context.outputFolder, "logs.txt")

    companion object {
        const val ERROR_KEY = "error"
        val DEFAULT_TIMEOUT = 1.hours
    }

    suspend fun execute() {
        results = loadFromCache()
            ?: runScript()
    }

    /**
     * It is possible that two scripts are executed with the same parameters at the same time.
     * If so, we wait for the other one to complete and then use it's result as cache.
     */
    suspend fun waitForResults() {
        // TODO: Could use join() on a job, if we had a job to join with...
        logger.debug("Waiting for run completion... {}", context.outputFolder)
        while(!this::results.isInitialized) {
            delay(100L)
        }
    }

    private fun loadFromCache(): Map<String, Any>? {
        // Looking for a cached result most recent than the script
        if (resultFile.exists()) {
            if (scriptFile.lastModified() < resultFile.lastModified()) {
                kotlin.runCatching {
                    RunContext.gson.fromJson<Map<String, Any>>(
                        resultFile.readText().also { logger.trace("Cached outputs: $it") },
                        object : TypeToken<Map<String, Any>>() {}.type
                    )
                }.onSuccess { previousOutputs ->
                    // Use this result only if there was no error and inputs have not changed
                    if (previousOutputs[ERROR_KEY] == null) {
                        if(inputsOlderThanCache()) {
                            logger.debug("Loading from cache")
                            return previousOutputs
                        }
                    } else {
                        logBuffer += "There was an error in previous run: running again.\n".also { logger.debug(it) }
                    }
                }.onFailure { e ->
                    logBuffer += "Cache could not be reused: ${e.message}\n".also { logger.warn(it) }
                }

            } else {
                val cleanOption = System.getenv("SCRIPT_SERVER_CACHE_CLEANER")
                logBuffer += (
                        "Script was updated, flushing the cache for this script with option $cleanOption.\n" +
                        "Script time: ${scriptFile.lastModified()}\n" +
                        "Result time: ${resultFile.lastModified()}\n"
                        ).also { logger.debug(it) }

                when(cleanOption) {
                    "partial" ->
                        if (!context.outputFolder.deleteRecursively()) {
                            throw RuntimeException("Failed to delete cache for modified script at ${context.outputFolder.parentFile.path}")
                        }
                    else -> // "full" or unset
                        if (!context.outputFolder.parentFile.deleteRecursively()) {
                            throw RuntimeException("Failed to delete cache for modified script at ${context.outputFolder.parentFile.path}")
                        }
                }
            }
        } else {
            logBuffer += "Previous results not found: running for the first time.\n".also { logger.debug(it) }
        }

        return null
    }

    /**
     * @return true if all inputs are older than cached result
     */
    private fun inputsOlderThanCache(): Boolean {
        if (context.inputFile.exists()) {
            val cacheTime = resultFile.lastModified()
            kotlin.runCatching {
                RunContext.gson.fromJson<Map<String, Any?>>(
                    context.inputFile.readText().also { logger.trace("Cached inputs: $it") },
                    object : TypeToken<Map<String, Any?>>() {}.type
                )
            }.onSuccess { inputs ->
                inputs.forEach { (_, value) ->
                    value?.toString().let { stringValue ->
                        // We assume that all local paths start with / and that URLs won't.
                        if (stringValue?.startsWith('/') == true) {
                            with(File(stringValue)) {
                                // check if missing or newer than cache
                                if (!exists()) {
                                    logBuffer += "Cannot reuse cache: input file $this does not exist.\n".also { logger.warn(it) }
                                    return false
                                }

                                if(cacheTime < lastModified()) {
                                    logBuffer += ("Cannot reuse cache: input file has been modified.\n" +
                                            "Cache time: $cacheTime\n" +
                                            "File time:  ${lastModified()}\n" +
                                            "File: $this \n").also { logger.warn(it) }
                                    return false
                                }
                            }
                        }
                    }
                }
            }.onFailure { e ->
                logger.warn("Error reading previous inputs: ${e.message}")
                return false // We could not validate inputs, discard the cache.
            }

            return true

        } else {
            return true // no input file => cache valid
        }
    }

    @OptIn(ExperimentalTime::class)
    private suspend fun runScript(): Map<String, Any> {
        if (!scriptFile.exists()) {
            val message = "Script $scriptFile not found"
            logger.warn(message)
            return flagError(mapOf(ERROR_KEY to message), true)
        }

        // Run the script
        var error = false
        var outputs: Map<String, Any>? = null

        val elapsed = measureTime {
            val pidFile = File(context.outputFolder.absolutePath, ".pid")

            runCatching {
                // TODO: Errors are using the log file. If this initial step fails, they might be appended to previous log.
                withContext(Dispatchers.IO) {
                    // If loading from cache didn't succeed, make sure we have a clean slate.
                    if (context.outputFolder.exists()) {
                        context.outputFolder.deleteRecursively()

                        if (context.outputFolder.exists())
                            throw RuntimeException("Failed to delete directory of previous run ${context.outputFolder.path}")
                    }

                    // Create the output folder for this invocation
                    context.outputFolder.mkdirs()
                    logger.debug("Script run outputting to {}", context.outputFolder)

                    // Script run pre-requisites
                    logFile.writeText(logBuffer)
                    context.inputs?.let {
                        // Create input.json
                        context.inputFile.writeText(it)
                    }
                }


                var runner = ""
                val command:List<String>
                when (scriptFile.extension) {
                    "jl", "JL" ->  {
                        runner = "biab-runner-julia"
                        command = listOf("/usr/local/bin/docker", "exec", "-i", runner, "julia", "-e",
                            """
                            open("${pidFile.absolutePath}", "w") do file write(file, string(getpid())) end;
                            ARGS=["${context.outputFolder.absolutePath}"];
                            include("${scriptFile.absolutePath}")
                            rm("${pidFile.absolutePath}")
                            """
                        )
                    }

                    "r", "R" -> {
                        runner = "biab-runner-r"
                        command = listOf(
                            "/usr/local/bin/docker", "exec", "-i", runner, "Rscript", "-e", 
                            """
                            fileConn<-file("${pidFile.absolutePath}"); writeLines(c(as.character(Sys.getpid())), fileConn); close(fileConn);
                            context.outputFolder<-"${context.outputFolder.absolutePath}";
                            tryCatch(source("${scriptFile.absolutePath}"),
                                error=function(e) if(grepl("ignoring SIGPIPE signal",e${"$"}message)) {
                                        print("Suppressed: 'ignoring SIGPIPE signal'");
                                    } else {
                                        stop(e);
                                    });
                            unlink("${pidFile.absolutePath}");
                            gc();
                            """
                        )
                    }

                    "sh" -> command = listOf("sh", scriptFile.absolutePath, context.outputFolder.absolutePath)
                    "py", "PY" -> command = listOf("python3", scriptFile.absolutePath, context.outputFolder.absolutePath)
                    else -> {
                        log(logger::warn, "Unsupported script extension ${scriptFile.extension}")
                        return flagError(mapOf(), true)
                    }
                }

                ProcessBuilder(command)
                    .directory(RunContext.scriptRoot)
                    .redirectOutput(ProcessBuilder.Redirect.PIPE)
                    .redirectErrorStream(true) // Merges stderr into stdout
                    .start().also { process ->
                        withContext(Dispatchers.IO) { // More info on this context switching : https://elizarov.medium.com/blocking-threads-suspending-coroutines-d33e11bf4761
                            // The watchdog will terminate the process in two cases :
                            // if the user cancels or if 60 minutes delay expires.
                            val watchdog = launch {
                                try {
                                    delay(timeout.toLong(DurationUnit.MILLISECONDS))
                                    throw TimeoutException("Timeout occurred after $timeout")

                                } catch (ex: Exception) {
                                    if (process.isAlive) {
                                        val event = ex.message ?: ex.javaClass.name

                                        if (pidFile.exists() && runner.isNotEmpty()) {
                                            val pid = pidFile.readText().trim()
                                            log(logger::debug, "$event: killing runner process '$pid'")

                                            ProcessBuilder(listOf(
                                                    "/usr/local/bin/docker", "exec", "-i", runner,
                                                    "kill", "-s", "TERM", pid
                                            )).start()

                                            if (!process.waitFor(10, TimeUnit.SECONDS)) {
                                                ProcessBuilder(listOf(
                                                        "/usr/local/bin/docker", "exec", "-i", runner,
                                                        "kill", "-s", "KILL", pid
                                                )).start()
                                            }

                                        } else {
                                            log(logger::info, "$event: killing server process...")
                                            process.destroy()
                                        }

                                        if (!process.waitFor(10, TimeUnit.SECONDS)) {
                                            log(logger::info, "$event: cancellation timeout elapsed.")
                                            process.destroyForcibly()
                                        }

                                        throw ex
                                    }
                                }
                            }

                            launch {
                                process.inputStream.bufferedReader().run {
                                    try {
                                        while (true) { // Breaks when readLine returns null
                                            readLine()?.let { log(logger::trace, it) }
                                                ?: break
                                        }
                                    } catch (ex: IOException) {
                                        if (ex.message != "Stream closed") // This is normal when cancelling the script
                                            log(logger::trace, ex.message!!)
                                    }
                                }
                            }

                            process.waitFor()
                            watchdog.cancel("Watched task normal completion")
                        }
                    }
            }.onSuccess { process -> // completed, with success or failure
                if (process.exitValue() != 0) {
                    error = true
                    log(logger::warn, "Error: script returned non-zero value")
                }

                if (resultFile.exists()) {
                    val type = object : TypeToken<Map<String, Any>>() {}.type
                    val result = resultFile.readText()
                    try {
                        outputs = RunContext.gson.fromJson<Map<String, Any>>(result, type)
                        logger.debug("Output: $result")
                    } catch (e: Exception) {
                        error = true
                        log(
                            logger::warn, """
                        ${e.message}
                        Error: Malformed JSON file.
                        Make sure complex results are saved in a separate file (csv, geojson, etc.).
                        Contents of output.json:
                    """.trimIndent() + "\n$result"
                        )
                    }
                } else {
                    error = true
                    log(logger::warn, "Error: output.json file not found")
                }

            }.onFailure { ex ->
                when (ex) {
                    is TimeoutException,
                    is CancellationException -> {
                        val event = ex.message ?: ex.javaClass.name
                        log(logger::info, "$event: done.")
                        outputs = mapOf(ERROR_KEY to event)
                        resultFile.writeText(RunContext.gson.toJson(outputs))
                    }
                    else -> {
                        log(logger::warn, "An error occurred when running the script: ${ex.message}")
                        logger.warn(ex.stackTraceToString())
                        error = true
                    }
                }
            }

            pidFile.delete()
        }
        log(logger::info, "Elapsed: $elapsed")

        // Format log output
        return flagError(outputs ?: mapOf(), error)
    }

    private fun log(func: (String?) -> Unit, line: String) {
        func(line) // realtime logging
        logFile.appendText("$line\n") // record
    }

    private fun flagError(results: Map<String, Any>, error: Boolean): Map<String, Any> {
        if (error || results.isEmpty()) {
            if (!results.containsKey(ERROR_KEY)) {
                val outputs = results.toMutableMap()
                outputs[ERROR_KEY] = "An error occurred. Check logs for details."

                // Rewrite output file with error
                resultFile.writeText(RunContext.gson.toJson(outputs))

                return outputs
            }
        }
        return results
    }
}