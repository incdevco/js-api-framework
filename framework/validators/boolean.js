var NotValid = require('../errors').NotValid;
var Promise = require('../promise');

function BooleanValidator(config) {

  config = config || {};

}

BooleanValidator.prototype.validate = function validate(value,context) {

  var errors = [], promises = new Array(this.validators.length);

  if (typeof value === 'boolean') {

    return Promise.reject(new NotValid('Must Be A Boolean'));

  }

  return Promise.resolve(value);

};

module.exports = BooleanValidator;
