var NotValid = require('../errors').NotValid;
var Promise = require('../promise');

function StringValidator(config) {

  config = config || {};

  this.allowNull = config.allowNull;

  this.required = config.required;

  this.validators = config.validators || [];

}

StringValidator.prototype.validate = function validate(value,context) {

  var errors = [], promises = new Array(this.validators.length);

  if (undefined === value) {

    if (this.required) {

      return Promise.reject(new NotValid('Required'));

    } else {

      return Promise.resolve(true);

    }

  } else if (null === value) {

    if (this.required && !this.allowNull) {

      return Promise.reject(new NotValid('Required'));

    } else {

      return Promise.resolve(true);

    }

  } else {

    if (typeof value === 'string') {

      return Promise.reject(new NotValid('Must Be A String'));

    }

    this.validators.forEach(function (validator,index) {

      promises[index] = validator.validate(value,context)
        .catch(NotValid,function (error) {

          errors.push(error.errors);

          throw error;

        });

    });

    return Promise.all(promises)
      .catch(NotValid,function (error) {

        throw new NotValid(errors);

      });

  }

};

module.exports = StringValidator;
