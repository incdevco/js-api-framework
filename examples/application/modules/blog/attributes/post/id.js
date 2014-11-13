var base = process.env.PWD;

var Framework = require(base+'/framework');

module.exports = function (config) {
	
	var attribute;
	
	config = config || {};
	
	if (undefined === config.max) {
		
		config.max = 5;
		
	}
	
	if (undefined === config.min) {
		
		config.min = 5;
		
	}
	
	if (undefined === config.required) {
		
		config.required = true;
		
	}
	
	if (undefined === config.validators) {
		
		config.validators = [
			new Framework.Validators.AlphaNumeric()
		];
		
	}
	
	attribute = new Framework.Attribute(config);
	
	return attribute;
	
};