var NotValid = require("../errors").NotValid;
var Promise = require("../promise");

function ObjectValidator(config) {
  "use strict";

  config = config || {};

  this.object = config.object || {};
  this.validators = config.validators || [];

}

ObjectValidator.prototype.validate = function validate(value, context) {
  "use strict";

  var errors = {
      object: {},
      validators: []
    },
    keys = Object.keys(this.object),
    promises = [],
    self = this;

  context = context || value;

  if (typeof value !== "object" || Array.isArray(value)) {

    return Promise.reject(new NotValid("Must Be An Object"));

  }

  keys.forEach(function (key) {

    console.log("key", key);

    promises.push(self.object[key].validate(value[key], value)
      .catch(NotValid, function (error) {

        errors.object[key] = error.errors;

        throw error;

      }));

  });

  this.validators.forEach(function (validator) {

    promises.push(validator.validate(value, context)
      .catch(NotValid, function (error) {

        errors.validators.push(error.errors);

        throw error;

      }));

  });

  return Promise.all(promises)
    .then(function () {

      return value;

    })
    .catch(NotValid, function () {

      throw new NotValid(errors);

    });

};

module.exports = ObjectValidator;
