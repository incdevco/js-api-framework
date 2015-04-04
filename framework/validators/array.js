var Expect = require('../expect');
var NotValid = require('../errors').NotValid;
var Promise = require('../promise');

function ArrayValidator(config) {

  config = config || {};

  if (config.array) {

    Expect(config.array).to.be.instanceof(Array);

    config.array.forEach(function (validator) {

      Expect(validator.validate).to.be.a('function');

    });

  }

  if (config.item) {

    Expect(config.item).to.be.instanceof(Array);

    config.item.forEach(function (validator) {

      Expect(validator.validate).to.be.a('function');

    });

  }

  this.array = config.array || [];
  this.item = config.item || [];

}

ArrayValidator.prototype.validate = function validate(value,context) {

  var errors = {
      array: [],
      item: []
    },
    promises = [],
    validator = this;

  if (!Array.isArray(value)) {

    return Promise.reject(new NotValid('Must Be An Array'));

  }

  value.forEach(function (item,index) {

    promises.push(validator.validateItem(item,value)
      .catch(NotValid,function (error) {

        errors.item[index] = error.errors;

        throw error;

      }));

  });

  this.array.forEach(function (validator) {

    promises.push(validator.validate(value,value)
      .catch(NotValid,function (error) {

        errors.array.push(error.errors);

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

  this.item.forEach(function (validator,index) {

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
