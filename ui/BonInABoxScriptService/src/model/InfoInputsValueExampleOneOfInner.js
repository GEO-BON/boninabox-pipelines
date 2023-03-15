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

/**
 * The InfoInputsValueExampleOneOfInner model module.
 * @module model/InfoInputsValueExampleOneOfInner
 * @version 1.0.0
 */
class InfoInputsValueExampleOneOfInner {
    /**
     * Constructs a new <code>InfoInputsValueExampleOneOfInner</code>.
     * @alias module:model/InfoInputsValueExampleOneOfInner
     * @param {(module:model/Boolean|module:model/Number|module:model/String)} instance The actual instance to initialize InfoInputsValueExampleOneOfInner.
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

        if (match > 1) {
            throw new Error("Multiple matches found constructing `InfoInputsValueExampleOneOfInner` with oneOf schemas Boolean, Number, String. Input: " + JSON.stringify(instance));
        } else if (match === 0) {
            this.actualInstance = null; // clear the actual instance in case there are multiple matches
            throw new Error("No match found constructing `InfoInputsValueExampleOneOfInner` with oneOf schemas Boolean, Number, String. Details: " +
                            errorMessages.join(", "));
        } else { // only 1 match
            // the input is valid
        }
    }

    /**
     * Constructs a <code>InfoInputsValueExampleOneOfInner</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/InfoInputsValueExampleOneOfInner} obj Optional instance to populate.
     * @return {module:model/InfoInputsValueExampleOneOfInner} The populated <code>InfoInputsValueExampleOneOfInner</code> instance.
     */
    static constructFromObject(data, obj) {
        return new InfoInputsValueExampleOneOfInner(data);
    }

    /**
     * Gets the actual instance, which can be <code>Boolean</code>, <code>Number</code>, <code>String</code>.
     * @return {(module:model/Boolean|module:model/Number|module:model/String)} The actual instance.
     */
    getActualInstance() {
        return this.actualInstance;
    }

    /**
     * Sets the actual instance, which can be <code>Boolean</code>, <code>Number</code>, <code>String</code>.
     * @param {(module:model/Boolean|module:model/Number|module:model/String)} obj The actual instance.
     */
    setActualInstance(obj) {
       this.actualInstance = InfoInputsValueExampleOneOfInner.constructFromObject(obj).getActualInstance();
    }

    /**
     * Returns the JSON representation of the actual instance.
     * @return {string}
     */
    toJSON = function(){
        return this.getActualInstance();
    }

    /**
     * Create an instance of InfoInputsValueExampleOneOfInner from a JSON string.
     * @param {string} json_string JSON string.
     * @return {module:model/InfoInputsValueExampleOneOfInner} An instance of InfoInputsValueExampleOneOfInner.
     */
    static fromJSON = function(json_string){
        return InfoInputsValueExampleOneOfInner.constructFromObject(JSON.parse(json_string));
    }
}


InfoInputsValueExampleOneOfInner.OneOf = ["Boolean", "Number", "String"];

export default InfoInputsValueExampleOneOfInner;

