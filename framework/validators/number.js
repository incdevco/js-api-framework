var NotValid = require("../errors").NotValid;
var Promise = require("../promise");

function NumberValidator(config) {
  "use strict";

  config = config || {};

  this.required = config.required;
  this.validators = config.validators || [];

}

NumberValidator.prototype.validate = function validate(value, context) {
  "use strict";

  var errors = [], promises = new Array(this.validators.length);

  if (value === undefined || value === null) {

    if (this.required) {

      return Promise.reject(new NotValid("Required"));

    } else {

      return Promise.resolve(true);

    }

  }

  if (typeof value !== "number") {

    return Promise.reject(new NotValid("Must Be A Number"));

  }

  this.validators.forEach(function (validator, index) {

    promises[index] = validator.validate(value, context)
      .catch(NotValid, function (error) {

        errors.push(error.errors);

        throw error;

      });

  });

  return Promise.all(promises)
    .then(function () {

      return value;

    })
    .catch(NotValid, function () {

      throw new NotValid(errors);

    });

};

module.exports = NumberValidator;
