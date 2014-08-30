
var RegexValidator = require('./regex');

function NumericValidator(config) {
	
	config = config || {};
	
	config.message = config.message || 'Only Numeric Characters Allowed';
	config.regex = /^[0-9]+$/;
	
	RegexValidator.call(this,config);
	
}

NumericValidator.prototype = Object.create(RegexValidator.prototype);
NumericValidator.prototype.constructor = NumericValidator;

module.exports = NumericValidator;