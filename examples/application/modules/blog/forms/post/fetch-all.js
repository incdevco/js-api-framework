var base = process.env.PWD;

var Framework = require(+'/framework');

var BlogId = require('../../attributes/blog/id');

module.exports = function (config) {
	
	var form;
	
	config = config || {};
	
	if (undefined === config.attributes) {
		
		config.attributes = {
			blog_id: BlogId({
				exists: true,
				required: false
			})
		};
		
	}
	
	form = new Framework.Form(config);
	
	return form;
	
};