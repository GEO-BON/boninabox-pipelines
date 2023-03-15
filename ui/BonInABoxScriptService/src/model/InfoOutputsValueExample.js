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

import ApiClient from '../ApiClient';
import InfoInputsValueExampleOneOfInner from './InfoInputsValueExampleOneOfInner';

/**
 * The InfoOutputsValueExample model module.
 * @module model/InfoOutputsValueExample
 * @version 1.0.0
 */
class InfoOutputsValueExample {
    /**
     * Constructs a new <code>InfoOutputsValueExample</code>.
     * @alias module:model/InfoOutputsValueExample
     * @param {(module:model/Boolean|module:model/Number|module:model/String|module:model/[InfoInputsValueExampleOneOfInner])} instance The actual instance to initialize InfoOutputsValueExample.
     */
    constructor(instance = null) {
        if (instance === null) {
            this.actualInstance = null;
            return;
        }
        var match = 0;
        var errorMessages = [];
        try {
            // validate string
            if (!(typeof instance === 'string')) {
                throw new Error("Invalid value. Must be string. Input: " + JSON.stringify(instance));
            }
            this.actualInstance = instance;
            match++;
        } catch(err) {
            // json data failed to deserialize into String
            errorMessages.push("Failed to construct String: " + err)
        }

        try {
            // validate number
            if (!(typeof instance === 'number' && instance % 1 != 0)) {
                throw new Error("Invalid value. Must be number. Input: " + JSON.stringify(instance));
            }
            this.actualInstance = instance;
            match++;
        } catch(err) {
            // json data failed to deserialize into Number
            errorMessages.push("Failed to construct Number: " + err)
        }

        try {
            // validate boolean
            if (!(typeof instance === 'boolean')) {
                throw new Error("Invalid value. Must be boolean. Input: " + JSON.stringify(instance));
            }
            this.actualInstance = instance;
            match++;
        } catch(err) {
            // json data failed to deserialize into Boolean
            errorMessages.push("Failed to construct Boolean: " + err)
        }

        try {
            if (typeof instance === "[InfoInputsValueExampleOneOfInner]") {
                this.actualInstance = instance;
            } else {
                // plain JS object
                // validate the object
                [InfoInputsValueExampleOneOfInner].validateJSON(instance); // throw an exception if no match
                // create [InfoInputsValueExampleOneOfInner] from JS object
                this.actualInstance = [InfoInputsValueExampleOneOfInner].constructFromObject(instance);
            }
            match++;
        } catch(err) {
            // json data failed to deserialize into [InfoInputsValueExampleOneOfInner]
            errorMessages.push("Failed to construct [InfoInputsValueExampleOneOfInner]: " + err)
        }

        if (match > 1) {
            throw new Error("Multiple matches found constructing `InfoOutputsValueExample` with oneOf schemas Boolean, Number, String, [InfoInputsValueExampleOneOfInner]. Input: " + JSON.stringify(instance));
        } else if (match === 0) {
            this.actualInstance = null; // clear the actual instance in case there are multiple matches
            throw new Error("No match found constructing `InfoOutputsValueExample` with oneOf schemas Boolean, Number, String, [InfoInputsValueExampleOneOfInner]. Details: " +
                            errorMessages.join(", "));
        } else { // only 1 match
            // the input is valid
        }
    }

    /**
     * Constructs a <code>InfoOutputsValueExample</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/InfoOutputsValueExample} obj Optional instance to populate.
     * @return {module:model/InfoOutputsValueExample} The populated <code>InfoOutputsValueExample</code> instance.
     */
    static constructFromObject(data, obj) {
        return new InfoOutputsValueExample(data);
    }

    /**
     * Gets the actual instance, which can be <code>Boolean</code>, <code>Number</code>, <code>String</code>, <code>[InfoInputsValueExampleOneOfInner]</code>.
     * @return {(module:model/Boolean|module:model/Number|module:model/String|module:model/[InfoInputsValueExampleOneOfInner])} The actual instance.
     */
    getActualInstance() {
        return this.actualInstance;
    }

    /**
     * Sets the actual instance, which can be <code>Boolean</code>, <code>Number</code>, <code>String</code>, <code>[InfoInputsValueExampleOneOfInner]</code>.
     * @param {(module:model/Boolean|module:model/Number|module:model/String|module:model/[InfoInputsValueExampleOneOfInner])} obj The actual instance.
     */
    setActualInstance(obj) {
       this.actualInstance = InfoOutputsValueExample.constructFromObject(obj).getActualInstance();
    }

    /**
     * Returns the JSON representation of the actual instance.
     * @return {string}
     */
    toJSON = function(){
        return this.getActualInstance();
    }

    /**
     * Create an instance of InfoOutputsValueExample from a JSON string.
     * @param {string} json_string JSON string.
     * @return {module:model/InfoOutputsValueExample} An instance of InfoOutputsValueExample.
     */
    static fromJSON = function(json_string){
        return InfoOutputsValueExample.constructFromObject(JSON.parse(json_string));
    }
}


InfoOutputsValueExample.OneOf = ["Boolean", "Number", "String", "[InfoInputsValueExampleOneOfInner]"];

export default InfoOutputsValueExample;

