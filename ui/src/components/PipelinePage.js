import React, { useState, useRef, useEffect } from 'react';
import Select from 'react-select';

import { SingleOutputResult, StepResult } from "./StepResult";
import { InputFileWithExample } from './InputFileWithExample';
import { FoldableOutputWithContext, RenderContext, createContext, FoldableOutput } from './FoldableOutput'

import { useInterval } from '../UseInterval';

import spinnerImg from '../img/spinner.svg';
import errorImg from '../img/error.svg';
import warningImg from '../img/warning.svg';
import infoImg from '../img/info.svg';
import { LogViewer } from './LogViewer';
import { GeneralDescription } from './ScriptDescription';

const BonInABoxScriptService = require('bon_in_a_box_script_service');
const yaml = require('js-yaml');
const api = new BonInABoxScriptService.DefaultApi();

export function PipelinePage(props) {
  const [runId, setRunId] = useState(null);
  const [stoppable, setStoppable] = useState(null);
  const [runningScripts, setRunningScripts] = useState(new Set());
  const [resultsData, setResultsData] = useState(null);
  const [httpError, setHttpError] = useState(null);
  const [pipelineMetadata, setPipelineMetadata] = useState(null);

  function showHttpError(error, response){
    if(response && response.text) 
      setHttpError(response.text)
    else if(error)
      setHttpError(error.toString())
    else 
      setHttpError(null)
  }

  let timeout
  function loadPipelineOutputs() {
    if (runId) {
      api.getPipelineOutputs(runId, (error, data, response) => {
        if (error) {
          showHttpError(error, response)
        } else {
          let allOutputFoldersKnown = Object.values(data).every(val => val !== "")
          if(!allOutputFoldersKnown) { // try again later
            timeout = setTimeout(loadPipelineOutputs, 1000)
          }

          setResultsData(data);
        }
      });
    } else {
      setResultsData(null);
    }
  }

  function showMetadata() {
    if (pipelineMetadata) {
      let yamlString = yaml.dump(pipelineMetadata)
      return (
        <pre key="metadata">
          {yamlString.startsWith("{}") ? "No metadata" : yamlString}
        </pre>
      )
    }
    return ""
  }

  useEffect(() => {
    setStoppable(runningScripts.size > 0)
  }, [runningScripts])

  const stop = () => {
    setStoppable(false)
    api.stopPipeline(runId, (error, data, response) => {
        if(response.status === 200) {
          setHttpError("Cancelled by user")
        }
    })
  }

  // Called when ID changes
  useEffect(() => {
    setResultsData(null);
    loadPipelineOutputs()

    return function cleanup() {
      if(timeout) clearTimeout(timeout)
    };
  // Called only when ID changes. Including all deps would result in infinite loop.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId])

  return (
    <>
      <h2>Pipeline run</h2>
      <FoldableOutput title="Input form" isActive={!runId} keepWhenHidden={true}>
        <PipelineForm
          pipelineMetadata={pipelineMetadata} setPipelineMetadata={setPipelineMetadata}
          setRunId={setRunId}
          showHttpError={showHttpError} />
        {showMetadata()}
      </FoldableOutput>
      
      {runId && <button onClick={stop} disabled={!stoppable}>Stop</button>}
      {httpError && <p key="httpError" className="error">{httpError}</p>}
      {pipelineMetadata && <PipelineResults key="results"
        pipelineMetadata={pipelineMetadata} resultsData={resultsData}
        runningScripts={runningScripts} setRunningScripts={setRunningScripts} />}
    </>)
}

function PipelineForm({pipelineMetadata, setPipelineMetadata, setRunId, showHttpError}) {
  const formRef = useRef()
  const inputRef = useRef();

  const defaultPipeline = "helloWorld.json";
  const [pipelineOptions, setPipelineOptions] = useState([]);

  function clearPreviousRequest() {
    showHttpError(null)
    setRunId(null)
  }

  function loadPipelineMetadata(choice) {
    clearPreviousRequest()
    setPipelineMetadata(null);

    var callback = function (error, data, response) {
      if(error) {
        showHttpError(error, response)
      } else if(data) {
        setPipelineMetadata(data);
      }
    };

    api.getPipelineInfo(choice, callback);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    runScript();
  };

  const runScript = () => {
    var callback = function (error, data , response) {
      if (error) { // Server / connection errors. Data will be undefined.
        data = {};
        showHttpError(error, response)

      } else if (data) {
        setRunId(data);
      } else {
        showHttpError("Server returned empty result");
      }
    };

    clearPreviousRequest()
    let opts = {
      'body': inputRef.current.getValue() // String | Content of input.json for this run
    };
    api.runPipeline(formRef.current.elements["pipelineChoice"].value, opts, callback);
  };

  // Applied only once when first loaded
  useEffect(() => {
    // Load list of scripts into pipelineOptions
    api.pipelineListGet((error, data, response) => {
      if (error) {
        console.error(error);
      } else {
        let newOptions = [];
        data.forEach(script => newOptions.push({ label: script, value: script }));
        setPipelineOptions(newOptions);
        loadPipelineMetadata(defaultPipeline);
      }
    });
    // Empty dependency array to get script list only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form ref={formRef} onSubmit={handleSubmit} acceptCharset="utf-8">
      <label>
        Pipeline:
        <br />
        <Select name="pipelineChoice" className="blackText" options={pipelineOptions}
          defaultValue={{ label: defaultPipeline, value: defaultPipeline }}
          onChange={(v) => loadPipelineMetadata(v.value)} />
      </label>
      <br />
      <label>
        Pipeline inputs:
        <br />
        <InputFileWithExample ref={inputRef} metadata={pipelineMetadata} />
      </label>
      <br />
      <input type="submit" disabled={false} value="Run pipeline" />
    </form>
  );
}

function PipelineResults({pipelineMetadata, resultsData, runningScripts, setRunningScripts}) {
  const [activeRenderer, setActiveRenderer] = useState({});
  const [pipelineOutputResults, setPipelineOutputResults] = useState({});

  useEffect(() => {
    if (resultsData === null) {
      // Put outputResults at initial value
      const initialValue = {}
      if (pipelineMetadata.outputs) {
        Object.keys(pipelineMetadata.outputs).forEach(key => {
          const script = key.substring(0, key.lastIndexOf('.'))
          initialValue[script] = {}
        })
      }
      setPipelineOutputResults(initialValue)
    }
  }, [pipelineMetadata.outputs, resultsData])
  
  if (resultsData) {
    return <RenderContext.Provider value={createContext(activeRenderer, setActiveRenderer)}>
      <h2>Pipeline outputs</h2>
      {pipelineMetadata.outputs && Object.entries(pipelineMetadata.outputs).map(entry => {
        const [key, stepDescription] = entry;
        const lastDotIx = key.lastIndexOf('.')
        const script = key.substring(0, lastDotIx)
        const outputId = key.substring(lastDotIx+1)
        const value = pipelineOutputResults[script] && pipelineOutputResults[script][outputId]

        if (!value) {
          return <div key={outputId} className="outputTitle">
            <h3>{stepDescription.label}</h3>
            {runningScripts.size > 0 ?
              <img src={spinnerImg} alt="Spinner" className="spinner-inline" />
              : <><img src={warningImg} alt="Warning" className="error-inline" />See detailed results</>
            }
          </div>
        }

        return <SingleOutputResult key={outputId} outputId={outputId}
          outputValue={value}
          outputMetadata={stepDescription} />
      })}

      <h2>Detailed results</h2>
      {Object.entries(resultsData).map((entry, i) => {
        const [key, value] = entry;

        return <DelayedResult key={key} id={key} folder={value}
          setRunningScripts={setRunningScripts} setPipelineOutputResults={setPipelineOutputResults} />
      })}
    </RenderContext.Provider>
  }
  else return null
}

function DelayedResult({id, folder, setRunningScripts, setPipelineOutputResults}) {
  const [resultData, setResultData] = useState(null)
  const [scriptMetadata, setScriptMetadata] = useState(null)
  const [running, setRunning] = useState(false)
  const [skippedMessage, setSkippedMessage] = useState()

  const step = id.substring(0, id.indexOf('@'))

  useEffect(() => { 
    // A script is running when we know it's folder but have yet no result nor error message
    let nowRunning = folder && !resultData
    setRunning(nowRunning)

    setRunningScripts((oldSet) => {
      let newSet = new Set(oldSet)
      nowRunning ? newSet.add(folder) : newSet.delete(folder)
      return newSet
    })
  }, [setRunningScripts, folder, resultData])

  useEffect(() => {
    if (folder) {
      if(folder === "skipped") {
        setResultData({ info: "Skipped: not necessary with the given parameters" })
        setSkippedMessage("Skipped")

      } else if(folder === "aborted") {
        setResultData({ warning: "Skipped due to previous failure" })
        setSkippedMessage("Aborted")
        
      } else if (folder === "cancelled") {
        setResultData({ warning: "Skipped when pipeline stopped" })
        setSkippedMessage("Cancelled")
      }
    }
  // Execute only when folder changes (omitting resultData on purpose)
  }, [folder]) 

  const interval = useInterval(() => {
    // Fetch the output
    fetch("output/" + folder + "/output.json")
      .then((response) => {
        if (response.ok) {
          clearInterval(interval);
          return response.json();
        }

        // Script not done yet: wait for next attempt
        if (response.status === 404) {
          return Promise.resolve(null)
        }
 
        return Promise.reject(response);
      })
      .then(json => {
        // Detailed results
        setResultData(json)

        // Contribute to pipeline outputs (if this script is relevant)
        setPipelineOutputResults(results => {
          if(id in results)
            results[id] = json
          
          return results
        })
      })
      .catch(response => {
        clearInterval(interval);
        setResultData({ error: response.status + " (" + response.statusText + ")" })
      });

  // Will start when folder has value, and continue the until resultData also has a value
  }, running ? 1000 : null)

  useEffect(() => { // Script metadata
    var callback = function (error, data, response) {
      setScriptMetadata(data)
    };

    api.getScriptInfo(step, callback);
  }, [step]);

  let content, inline = null;
  let className = "foldableScriptResult"
  if (folder) {
    if (resultData) {
      content = <StepResult data={resultData} metadata={scriptMetadata} />
      inline = <>
        {resultData.error && <img src={errorImg} alt="Error" className="error-inline" />}
        {resultData.warning && <img src={warningImg} alt="Warning" className="error-inline" />}
        {resultData.info && <img src={infoImg} alt="Info" className="info-inline" />}
        {skippedMessage && <i>{skippedMessage}</i>}
      </>
    } else {
      content = <p>Running...</p>
      inline = <img src={spinnerImg} alt="Spinner" className="spinner-inline" />
    }
  } else {
    content = <p>Waiting for previous steps to complete.</p>
    className += " gray"
  }

  let logsAddress = folder && "output/" + folder + "/logs.txt"
  
  return (
    <FoldableOutputWithContext title={step.replaceAll('>', ' > ').replace(/.yml$/, '')} componentId={id} inline={inline} className={className}>
      <GeneralDescription ymlPath={step} metadata={scriptMetadata} />
      {content}
      {folder && !skippedMessage && <LogViewer address={logsAddress} autoUpdate={!resultData} />}
    </FoldableOutputWithContext>
  )
}
