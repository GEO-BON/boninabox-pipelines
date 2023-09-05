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

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['expect.js', process.cwd()+'/src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require(process.cwd()+'/src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.BonInABoxScriptService);
  }
}(this, function(expect, BonInABoxScriptService) {
  'use strict';

  var instance;

  beforeEach(function() {
    instance = new BonInABoxScriptService.InfoOutputsValue();
  });

  var getProperty = function(object, getter, property) {
    // Use getter method if present; otherwise, get the property directly.
    if (typeof object[getter] === 'function')
      return object[getter]();
    else
      return object[property];
  }

  var setProperty = function(object, setter, property, value) {
    // Use setter method if present; otherwise, set the property directly.
    if (typeof object[setter] === 'function')
      object[setter](value);
    else
      object[property] = value;
  }

  describe('InfoOutputsValue', function() {
    it('should create an instance of InfoOutputsValue', function() {
      // uncomment below and update the code to test InfoOutputsValue
      //var instance = new BonInABoxScriptService.InfoOutputsValue();
      //expect(instance).to.be.a(BonInABoxScriptService.InfoOutputsValue);
    });

    it('should have the property description (base name: "description")', function() {
      // uncomment below and update the code to test the property description
      //var instance = new BonInABoxScriptService.InfoOutputsValue();
      //expect(instance).to.be();
    });

    it('should have the property label (base name: "label")', function() {
      // uncomment below and update the code to test the property label
      //var instance = new BonInABoxScriptService.InfoOutputsValue();
      //expect(instance).to.be();
    });

    it('should have the property type (base name: "type")', function() {
      // uncomment below and update the code to test the property type
      //var instance = new BonInABoxScriptService.InfoOutputsValue();
      //expect(instance).to.be();
    });

    it('should have the property range (base name: "range")', function() {
      // uncomment below and update the code to test the property range
      //var instance = new BonInABoxScriptService.InfoOutputsValue();
      //expect(instance).to.be();
    });

    it('should have the property options (base name: "options")', function() {
      // uncomment below and update the code to test the property options
      //var instance = new BonInABoxScriptService.InfoOutputsValue();
      //expect(instance).to.be();
    });

    it('should have the property properties (base name: "properties")', function() {
      // uncomment below and update the code to test the property properties
      //var instance = new BonInABoxScriptService.InfoOutputsValue();
      //expect(instance).to.be();
    });

    it('should have the property example (base name: "example")', function() {
      // uncomment below and update the code to test the property example
      //var instance = new BonInABoxScriptService.InfoOutputsValue();
      //expect(instance).to.be();
    });

  });

}));
