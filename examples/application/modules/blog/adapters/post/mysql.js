var base = process.env.PWD;

var Framework = require(base+'/framework');

var Pool = require(base+'/application/mysql').pool;

module.exports = function (config) {
	
	var adapter;
	
	config = config || {};
	
	if (undefined === config.pool) {
		
		config.pool = Pool;
		
	}
	
	if (undefined === config.primary) {
		
		config.primary = 'id';
		
	}
	
	if (undefined === config.table) {
		
		config.table = 'blog_post';
		
	}
	
	adapter = new Framework.Adapters.Mysql(config);
	
	return adapter;
	
};