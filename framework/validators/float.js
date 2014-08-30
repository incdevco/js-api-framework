
var RegexValidator = require('./regex');

function FloatValidator(config) {
	
	config = config || {};
	
	config.regex = /^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/;
	config.message = config.message || 'Not Valid Float';
	
	RegexValidator.call(this,config);
	
}

FloatValidator.prototype = Object.create(RegexValidator.prototype);
FloatValidator.prototype.constructor = FloatValidator;

module.exports = FloatValidator;