var base = process.env.PWD;

var Framework = require(base+'/framework');

module.exports = function (config) {
	
	var attribute;
	
	config = config || {};
	
	if (undefined === config.max) {
		
		config.max = 255;
		
	}
	
	if (undefined === config.min) {
		
		config.min = 1;
		
	}
	
	if (undefined === config.required) {
		
		config.required = true;
		
	}
	
	attribute = new Framework.Attribute(config);
	
	return attribute;
	
};