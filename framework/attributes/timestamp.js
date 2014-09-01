var Attribute = require('../attribute');

function TimestampAttribute(config) {
	
	config = config || {};
	
	config.max = 20;
	
	if (undefined === config.validators) {
	
		config.validators = [
			new Framework.Validators.Float()
		];
		
	}
	
	Attribute.call(this,config);
	
}

TimestampAttribute.prototype = Object.create(Attribute.prototype);
TimestampAttribute.prototype.constructor = TimestampAttribute;

module.exports = TimestampAttribute;