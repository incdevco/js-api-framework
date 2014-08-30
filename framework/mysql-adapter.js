var mysql = require('mysql');

var Promise = require('./promise');
var Sql = require('./sql');

function MysqlAdapter(config) {
	
	this.mysql = config.mysql;
	this.table = config.table;
	this.sql = Sql;
	
}

MysqlAdapter.prototype.connection = function (scope) {
	
	var adapter = this;
	
	return new Promise(function (resolve,reject) {
		
		if (scope.db) {
			
			resolve(scope.db);
			
		} else {
			
			adapter.mysql.pool.getConnection(function (error,connection) {
				
				if (error) {
					
					//console.error(error);
					
					reject(error);
					
				} else {
					
					resolve(connection);
					
				}
				
			});
			
		}
		
	});
	
};

MysqlAdapter.prototype.delete = function (where,limit,offset,scope) {
	
	var adapter = this;
	
	return new Promise(function (resolve,reject) {
		
		adapter.connection(scope).then(function (connection) {
			
			var query = Sql.delete().from(adapter.table);
			
			if (where) {
			
				query.where(where);
				
			}
			
			if (limit) {
			
				query.limit(limit);
				
			}
			
			if (offset) {
			
				query.offset(offset);
				
			}
			
			query = query.build();
			
			query = mysql.format(query.sql,query.inserts);
			
			console.log('mysql-adapter delete',query);
			
			connection.query(query,function (error,result) {
				
				if (!scope.db) {
					
					connection.release();
					
				}
				
				if (error) {
					
					reject(error);
					
				} else {
					
					resolve(result);
					
				}
				
			});
			
			
		});
		
	});
	
};

MysqlAdapter.prototype.fetchAll = function (where,limit,offset,scope) {
	
	var adapter = this;
	
	return new Promise(function (resolve,reject) {
		
		adapter.connection(scope).then(function (connection) {
			
			var query = Sql.select().from(adapter.table);
			
			if (where) {
			
				query.where(where);
				
			}
			
			if (limit) {
			
				query.limit(limit);
				
			}
			
			if (offset) {
			
				query.offset(offset);
				
			}
			
			query = query.build();
			
			query = mysql.format(query.sql,query.inserts);
			
			console.log('mysql-adapter.fetchAll',query);
			
			connection.query(query,function (error,results) {
				
				if (!scope.db) {
					
					connection.release();
					
				}
				
				if (error) {
					
					reject(error);
					
				} else {
					
					resolve(results);
					
				}
				
			});
			
		});
		
	});
	
};

MysqlAdapter.prototype.fetchRow = function (where,offset,scope) {
	
	var adapter = this;
	
	return new Promise(function (resolve,reject) {
		
		adapter.connection(scope).then(function (connection) {
			
			var query = Sql.select().from(adapter.table);
			
			if (where) {
			
				query.where(where);
				
			}
			
			query.limit(1);
			
			if (offset) {
			
				query.offset(offset);
				
			}
			
			query = query.build();
			
			query = mysql.format(query.sql,query.inserts);
			
			console.log('mysql-adapter.fetchRow',query);
			
			connection.query(query,function (error,results) {
				
				if (!scope.db) {
					
					connection.release();
					
				}
				
				if (error) {
					
					reject(error);
					
				} else {
					
					resolve(results[0]);
					
				}
				
			});
			
		});
		
	});
	
};

MysqlAdapter.prototype.insert = function (data,scope) {
	
	var adapter = this;
	
	return new Promise(function (resolve,reject) {
		
		adapter.connection(scope).then(function (connection) {
			
			var query = Sql.insert().into(adapter.table).set(data);
			
			query = query.build();
			
			query = mysql.format(query.sql,query.inserts);
			
			console.log('mysql-adapter.insert',query);
			
			connection.query(query,function (error,result) {
				
				if (!scope.db) {
					
					connection.release();
					
				}
				
				if (error) {
					
					reject(error);
					
				} else {
					
					resolve(result);
					
				}
				
			});
			
		});
		
	});
	
};

MysqlAdapter.prototype.update = function (data,where,scope) {
	
	var adapter = this;
	
	return new Promise(function (resolve,reject) {
		
		adapter.connection(scope).then(function (connection) {
			
			console.log('mysql-adapter.update',data,where);
			
			var query = Sql.update().table(adapter.table).set(data).where(where);
			
			query = query.build();
			
			query = mysql.format(query.sql,query.inserts);
			
			console.log('mysql-adapter.update',query);
			
			connection.query(query,function (error,result) {
				
				if (!scope.db) {
					
					connection.release();
					
				}
				
				if (error) {
					
					reject(error);
					
				} else {
					
					resolve(result);
					
				}
				
			});
			
		});
		
	});
	
};

module.exports = MysqlAdapter;