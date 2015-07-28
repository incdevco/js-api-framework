var base = process.env.PWD;

var Framework = require(+'/framework');

var Name = require('../../attributes/blog/name');
var Content = require('../../attributes/blog/content');

module.exports = function (config) {
	
	var form;
	
	config = config || {};
	
	if (undefined === config.attributes) {
		
		config.attributes = {
			name: Name,
			content: Content
		};
		
	}
	
	form = new Framework.Form(config);
	
	return form;
	
};