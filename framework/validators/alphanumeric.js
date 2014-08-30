var RegexValidator = require('./regex');

function AlphaNumericValidator(config) {
	
	config.message = config.message || 'Only Alphanumeric Characters Allowed';
	config.regex = /^[a-zA-Z0-9]+$/;
	
	RegexValidator.call(this,config);
	
}

AlphaNumericValidator.prototype = Object.create(RegexValidator.prototype);
AlphaNumericValidator.prototype.constructor = AlphaNumericValidator;

module.exports = AlphaNumericValidator;