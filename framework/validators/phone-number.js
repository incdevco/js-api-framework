var util = require('util');

var RegexValidator = require('./regex');

var regex = /^[+0-9]+$/;

function PhoneNumberValidator(config) {

	config = config || {};

	config.message = config.message || 'Only + and 0-9 Allowed';
	config.regex = config.regex || regex;

	RegexValidator.call(this,config);

}

util.inherits(PhoneNumberValidator,RegexValidator);

module.exports = PhoneNumberValidator;
