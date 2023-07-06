package org.geobon.server.plugins

import org.geobon.pipeline.outputRoot
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.io.File
import java.io.IOException
import kotlin.io.path.moveTo

const val CACHE_VERSION = "2.0"
val CACHE_VERSION_FILE = File(outputRoot, "cacheVersion.txt")

fun checkCacheVersion() {
    val logger: Logger = LoggerFactory.getLogger("Cache")

    val oldVersion = try { CACHE_VERSION_FILE.readText() } catch (_: IOException) { "0" }
    if (oldVersion == CACHE_VERSION) {
        logger.debug("Using cache version $CACHE_VERSION")
    } else {
        logger.debug("Upgrading cache from version $oldVersion to $CACHE_VERSION")
        outputRoot.listFiles()?.let { topLevelFiles ->
            val archivePath = File(outputRoot, "OLD_v$oldVersion")
            archivePath.mkdir()
            topLevelFiles.forEach {
                if(it.name != ".gitignore") {
                    it.toPath().moveTo(File(archivePath, it.name).toPath())
                }
            }
        }

        CACHE_VERSION_FILE.writeText(CACHE_VERSION)
    }
}