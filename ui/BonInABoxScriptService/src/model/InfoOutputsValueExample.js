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
     */
    constructor() { 
        
        InfoOutputsValueExample.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>InfoOutputsValueExample</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/InfoOutputsValueExample} obj Optional instance to populate.
     * @return {module:model/InfoOutputsValueExample} The populated <code>InfoOutputsValueExample</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new InfoOutputsValueExample();

        }
        return obj;
    }


}






export default InfoOutputsValueExample;

