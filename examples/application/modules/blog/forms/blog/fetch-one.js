var base = process.env.PWD;

var Framework = require(base+'/framework');

var Id = require('../../attributes/blog/id');

module.exports = function (config) {
	
	var form;
	
	config = config || {};
	
	if (undefined === config.attributes) {
		
		config.attributes = {
			id: Id
		};
		
	}
	
	form = new Framework.Form(config);
	
	return form;
	
};