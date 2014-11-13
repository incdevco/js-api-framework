var base = process.env.PWD;

var Framework = require(base+'/framework');

module.exports = function (config) {
	
	var form;
	
	config = config || {};
	
	if (undefined === config.attributes) {
		
		config.attributes = {};
		
	}
	
	form = new Framework.Form(config);
	
	return form;
	
};