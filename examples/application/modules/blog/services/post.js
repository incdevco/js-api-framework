var base = process.env.PWD;

var Framework = require(+'/framework');

var Forms = require('../forms/post');
var MysqlAdapter = require('../adapters/post/mysql');

module.exports = function (config) {
	
	var service;
	
	config = config || {};
	
	if (undefined === config.adapter) {
		
		config.adapter = MysqlAdapter;
		
	}
	
	if (undefined === config.forms) {
		
		config.forms = Forms;
		
	}
	
	if (undefined === config.primary) {
		
		config.primary = 'id';
		
	}
	
	if (undefined === config.resource) {
		
		config.resource = 'blog-post';
		
	}
	
	service = new Framework.Service(config);
	
	return service;
	
};