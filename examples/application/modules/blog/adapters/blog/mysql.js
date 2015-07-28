var base = process.env.PWD;

var Framework = require(+'/framework');

var Pool = require(+'/application/mysql').pool;

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
		
		config.table = 'blog';
		
	}
	
	adapter = new Framework.Adapters.Mysql(config);
	
	return adapter;
	
};