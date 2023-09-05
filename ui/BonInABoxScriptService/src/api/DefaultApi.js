/**
 * BON in a Box - Script service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: jean-michel.lord@mcgill.ca
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */


import ApiClient from "../ApiClient";
import Info from '../model/Info';

/**
* Default service.
* @module api/DefaultApi
* @version 1.0.0
*/
export default class DefaultApi {

    /**
    * Constructs a new DefaultApi. 
    * @alias module:api/DefaultApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }


    /**
     * Callback function to receive the result of the getInfo operation.
     * @callback module:api/DefaultApi~getInfoCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Info} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get metadata about this script or pipeline.
     * @param {module:model/String} type Script or pipeline
     * @param {String} descriptionPath Where to find the step. For scripts, paths are relative to the /script folder. For pipelines, paths are relative to the /pipeline folder.
     * @param {module:api/DefaultApi~getInfoCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Info}
     */
    getInfo(type, descriptionPath, callback) {
      let postBody = null;
      // verify the required parameter 'type' is set
      if (type === undefined || type === null) {
        throw new Error("Missing the required parameter 'type' when calling getInfo");
      }
      // verify the required parameter 'descriptionPath' is set
      if (descriptionPath === undefined || descriptionPath === null) {
        throw new Error("Missing the required parameter 'descriptionPath' when calling getInfo");
      }

      let pathParams = {
        'type': type,
        'descriptionPath': descriptionPath
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = Info;
      return this.apiClient.callApi(
        '/{type}/{descriptionPath}/info', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the getListOf operation.
     * @callback module:api/DefaultApi~getListOfCallback
     * @param {String} error Error message, if any.
     * @param {Object.<String, {String: String}>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get a list of available steps of given type and their names.
     * @param {module:model/String} type Script or pipeline
     * @param {module:api/DefaultApi~getListOfCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Object.<String, {String: String}>}
     */
    getListOf(type, callback) {
      let postBody = null;
      // verify the required parameter 'type' is set
      if (type === undefined || type === null) {
        throw new Error("Missing the required parameter 'type' when calling getListOf");
      }

      let pathParams = {
        'type': type
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = {'String': 'String'};
      return this.apiClient.callApi(
        '/{type}/list', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the getOutputFolders operation.
     * @callback module:api/DefaultApi~getOutputFoldersCallback
     * @param {String} error Error message, if any.
     * @param {Object.<String, {String: String}>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get the output folders of the scripts composing this pipeline
     * @param {module:model/String} type Script or pipeline
     * @param {String} id Where to find the pipeline in ./script folder.
     * @param {module:api/DefaultApi~getOutputFoldersCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Object.<String, {String: String}>}
     */
    getOutputFolders(type, id, callback) {
      let postBody = null;
      // verify the required parameter 'type' is set
      if (type === undefined || type === null) {
        throw new Error("Missing the required parameter 'type' when calling getOutputFolders");
      }
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling getOutputFolders");
      }

      let pathParams = {
        'type': type,
        'id': id
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = {'String': 'String'};
      return this.apiClient.callApi(
        '/{type}/{id}/outputs', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the getPipeline operation.
     * @callback module:api/DefaultApi~getPipelineCallback
     * @param {String} error Error message, if any.
     * @param {Object} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get JSON file that describes the pipeline.
     * @param {String} descriptionPath Where to find the step. For scripts, paths are relative to the /script folder. For pipelines, paths are relative to the /pipeline folder.
     * @param {module:api/DefaultApi~getPipelineCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Object}
     */
    getPipeline(descriptionPath, callback) {
      let postBody = null;
      // verify the required parameter 'descriptionPath' is set
      if (descriptionPath === undefined || descriptionPath === null) {
        throw new Error("Missing the required parameter 'descriptionPath' when calling getPipeline");
      }

      let pathParams = {
        'descriptionPath': descriptionPath
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = Object;
      return this.apiClient.callApi(
        '/pipeline/{descriptionPath}/get', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the run operation.
     * @callback module:api/DefaultApi~runCallback
     * @param {String} error Error message, if any.
     * @param {String} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Runs the script or pipeline matching `descriptionPath`.
     * @param {module:model/String} type Script or pipeline
     * @param {String} descriptionPath Where to find the step. For scripts, paths are relative to the /script folder. For pipelines, paths are relative to the /pipeline folder.
     * @param {Object} opts Optional parameters
     * @param {String} [body] Content of input.json for this run
     * @param {module:api/DefaultApi~runCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link String}
     */
    run(type, descriptionPath, opts, callback) {
      opts = opts || {};
      let postBody = opts['body'];
      // verify the required parameter 'type' is set
      if (type === undefined || type === null) {
        throw new Error("Missing the required parameter 'type' when calling run");
      }
      // verify the required parameter 'descriptionPath' is set
      if (descriptionPath === undefined || descriptionPath === null) {
        throw new Error("Missing the required parameter 'descriptionPath' when calling run");
      }

      let pathParams = {
        'type': type,
        'descriptionPath': descriptionPath
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = ['text/plain'];
      let accepts = ['text/plain'];
      let returnType = 'String';
      return this.apiClient.callApi(
        '/{type}/{descriptionPath}/run', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the stop operation.
     * @callback module:api/DefaultApi~stopCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Stop the specified pipeline run.
     * @param {module:model/String} type Script or pipeline
     * @param {String} id Where to find the pipeline in ./script folder.
     * @param {module:api/DefaultApi~stopCallback} callback The callback function, accepting three arguments: error, data, response
     */
    stop(type, id, callback) {
      let postBody = null;
      // verify the required parameter 'type' is set
      if (type === undefined || type === null) {
        throw new Error("Missing the required parameter 'type' when calling stop");
      }
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling stop");
      }

      let pathParams = {
        'type': type,
        'id': id
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = [];
      let returnType = null;
      return this.apiClient.callApi(
        '/{type}/{id}/stop', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }


}
