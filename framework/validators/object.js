var NotValid = require('../errors').NotValid;
var Promise = require('../promise');

function ObjectValidator(config) {

  config = config || {};

  this.object = config.object || {};
  this.validators = config.validators || [];

}

ObjectValidator.prototype.validate = function validate(value,context) {

  var errors = {
      object: {},
      validators: []
    },
    keys = Object.keys(this.object),
    promises = new Array(),
    validator = this;

  if (typeof value !== 'object' || Array.isArray(value)) {

    return Promise.reject(new NotValid('Must Be An Object'));

  }

  keys.forEach(function (key,index) {

    promises.push(validator.object[key].validate(value[key],context)
      .catch(NotValid,function (error) {

        errors.object[key] = error.errors;

        throw error;

      }));

  });

  this.validators.forEach(function (validator) {

    promises.push(validator.validate(value,context)
      .catch(NotValid,function (error) {

        errors.validators.push(error.errors);

        throw error;

      }));

  });

  return Promise.all(promises)
    .then(function () {

      return value;

    })
    .catch(NotValid,function (error) {

      throw new NotValid(errors);

    });

};

module.exports = ObjectValidator;
