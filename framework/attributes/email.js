var Attribute = require('../attribute');
var Validators = require('../validators');

function Email(config) {
	
	config = config || {};
	
	config.max = 250;
	
	if (undefined === config.validators) {
	
		config.validators = [
			new Validators.Email()
		];
		
	}
	
	Attribute.call(this,config);
	
}

Email.prototype = Object.create(Attribute.prototype);
Email.prototype.constructor = Email;

module.exports = Email;