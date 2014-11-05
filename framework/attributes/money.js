var Attribute = require('../attribute');
var Validators = require('../validators');

function Money(config) {
	
	config = config || {};
	
	config.max = 30;
	
	if (undefined === config.validators) {
	
		config.validators = [
			new Validators.Float()
		];
		
	}
	
	Attribute.call(this,config);
	
}

Money.prototype = Object.create(Attribute.prototype);
Money.prototype.constructor = Money;

module.exports = Money;