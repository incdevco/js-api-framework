var util = require('util');

var RegexValidator = require('./regex');

var regex = /^[0-9]+$/;

function NumericValidator(config) {

	config = config || {};

	config.message = config.message || 'Only Numeric Characters Allowed';
	config.regex = config.regex || regex;

	RegexValidator.call(this,config);

}

util.inherits(NumericValidator,RegexValidator);

module.exports = NumericValidator;
