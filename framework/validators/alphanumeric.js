var util = require('util');

var RegexValidator = require('./regex');

var regex = /^[a-zA-Z0-9]+$/;

function AlphaNumericValidator(config) {

	config = config || {};

	config.message = config.message || 'Only Alphanumeric Characters Allowed';
	config.regex = config.regex || regex;

	RegexValidator.call(this,config);

}

util.inherits(AlphaNumericValidator,RegexValidator);

module.exports = AlphaNumericValidator;
