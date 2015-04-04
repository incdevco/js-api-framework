var NotValid = require('../errors').NotValid;
var Promise = require('../promise');

function NumberValidator(config) {

  config = config || {};

  this.validators = config.validators || [];

}

NumberValidator.prototype.validate = function validate(value,context) {

  var errors = [], promises = new Array(this.validators.length);

  if (typeof value !== 'number') {

    return Promise.reject(new NotValid('Must Be A Number'));

  }

  this.validators.forEach(function (validator,index) {

    promises[index] = validator.validate(value,context)
      .catch(NotValid,function (error) {

        errors.push(error.errors);

        throw error;

      });

  });

  return Promise.all(promises)
    .then(function () {

      return value;

    })
    .catch(NotValid,function (error) {

      throw new NotValid(errors);

    });

};

module.exports = NumberValidator;
