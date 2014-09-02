var RegexValidator = require('./regex');

function IntegerValidator(config) {
	
	config = config || {};
	
	config.message = config.message || 'Only Integer Characters Allowed';
	config.regex = /^[0-9]+$/;
	
	RegexValidator.call(this,config);
	
}

IntegerValidator.prototype = Object.create(RegexValidator.prototype);
IntegerValidator.prototype.constructor = IntegerValidator;

module.exports = IntegerValidator;