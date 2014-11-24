var base = process.env.PWD;

var Framework = require(base+'/framework');

var BlogResource = require('./resources/blog');
var PostResource = require('./resources/post');

module.exports = function (config) {
	
	var module;
	
	config = config || {};
	
	if (undefined === config.resources) {
		
		config.resources = {
			Blog: BlogResource,
			Post: PostResource
		};
		
	}
	
	if (undefined === config.route) {
		
		config.route = '/blog';
		
	}
	
	module = new Framework.Module(config);
	
	return module;
	
};

module.exports = ;