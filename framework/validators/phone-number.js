
var RegexValidator = require('./regex');

function PhoneNumber(config) {
	
	config = config || {};
	
	config.message = config.message || 'Only + and 0-9 Allowed';
	config.regex = /^[+0-9]+$/;
	
	RegexValidator.call(this,config);
	
}

PhoneNumber.prototype = Object.create(RegexValidator.prototype);
PhoneNumber.prototype.constructor = PhoneNumber;

module.exports = PhoneNumber;