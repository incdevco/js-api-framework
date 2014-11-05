var Attribute = require('../attribute');
var Validators = require('../validators');

function PhoneNumber(config) {
	
	config = config || {};
	
	config.max = 30;
	
	if (undefined === config.validators) {
	
		config.validators = [
			new Validators.PhoneNumber()
		];
		
	}
	
	Attribute.call(this,config);
	
}

PhoneNumber.prototype = Object.create(Attribute.prototype);
PhoneNumber.prototype.constructor = PhoneNumber;

module.exports = PhoneNumber;