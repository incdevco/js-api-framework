var NotValid = require('../errors').NotValid;
var Promise = require('../promise');

function ArrayValidator(config) {

  config = config || {};

  this.array = config.array || [];
  this.validators = config.validators || [];

}

ArrayValidator.prototype.validate = function validate(value,context) {

  var errors = {
      array: null,
      validators: []
    }, promises, validator = this;

  if (!Array.isArray(value)) {

    return Promise.reject(new NotValid('Must Be An Array'));

  }

  errors.array = new Array(value.length);

  promises = []];

  value.forEach(function (item,index) {

    promises.push(validator.validateItem(item,value)
      .catch(NotValid,function (error) {

        errors.array[index] = error.errors;

        throw error;

      }));

  });

  this.validators.forEach(function (validator) {

    promises.push(validator.validate(value,value)
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

ArrayValidator.prototype.validateItem = function validateItem(item,value) {

  var errors = [], promises = new Array(this.array.length);

  this.array.forEach(function (validator,index) {

    promises[index] = validator.validate(item,value)
      .catch(NotValid,function (error) {

        errors.push(error.errors);

        throw error;

      });

  });

  return Promise.all(promises)
    .catch(NotValid,function () {

      throw new NotValid(errors);

    });

};

module.exports = ArrayValidator;
