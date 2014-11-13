var base = process.env.PWD;

var Framework = require(base+'/framework');

var BlogModule = require('./modules/blog');

module.exports = function (config) {
	
	var application;
	
	if (undefined === config.modules) {
		
		config.modules = {
			Blog: BlogModule
		};
		
	}
	
	application = new Framework.Application(config);
	
	return application;
	
};