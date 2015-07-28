var NotValid = require("../errors").NotValid;
var Promise = require("../promise");

function Validator(config) {
  "use strict";

  config = config || {};

  this.allowNull = config.allowNull;

  this.required = config.required;

  this.validators = config.validators || [];

}

Validator.prototype.validate = function validate(value, context) {
  "use strict";

  var errors = [], promises = new Array(this.validators.length);

  if (undefined === value) {

    if (this.required) {

      if (typeof this.required === "function") {

        if (this.required(value, context)) {

          return Promise.resolve(true);

        }

      }

      return Promise.reject(new NotValid("Required"));

    } else {

      return Promise.resolve(true);

    }

  } else if (value === null) {

    if (this.required && !this.allowNull) {

      if (typeof this.required === "function") {

        if (this.required(value, context)) {

          return Promise.resolve(true);

        }

      }

      return Promise.reject(new NotValid("Required"));

    } else {

      return Promise.resolve(true);

    }

  } else {

    if (typeof value !== "string") {

      return Promise.reject(new NotValid("Must Be A String"));

    }

    this.validators.forEach(function (validator, index) {

      promises[index] = validator.validate(value, context)
        .catch(NotValid, function (error) {

          errors.push(error.errors);

          throw error;

        });

    });

    return Promise.all(promises)
      .catch(NotValid, function () {

        throw new NotValid(errors);

      });

  }

};

module.exports = Validator;
