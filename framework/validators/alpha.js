var RegexValidator = require('./regex');

function AlphaValidator(config) {
	
	config.message = config.message || 'Only Alpha Characters Allowed';
	config.regex = /^[a-zA-Z]+$/;
	
	RegexValidator.call(this,config);
	
}

AlphaValidator.prototype = Object.create(RegexValidator.prototype);
AlphaValidator.prototype.constructor = AlphaValidator;

module.exports = AlphaValidator;