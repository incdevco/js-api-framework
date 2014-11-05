var crypto = require('crypto');

var Exceptions = require('../exceptions');
var Promise = require('../promise');
var Sql = require('../sql');

function Mysql(config) {
	
	if (!Array.isArray(config.primary)) {
		
		config.primary = [config.primary];
		
	}
	
	this.attributes = config.attributes;
	this.idLength = config.idLength;
	this.pool = config.pool;
	this.primary = config.primary;
	this.table = config.table;
	
}

Mysql.prototype._bootstrap = function _bootstrap(application) {
	
	this.pool = application.get('Mysql').Pool;
	
};

Mysql.prototype.connection = function connection(callback) {
	
	return this.pool.getConnection(callback);
	
};

Mysql.prototype.createId = function createId(length,key) {
	
	var adapter = this, promise;
	
	length = length || this.idLength;
	
	promise = new Promise(function (resolve,reject) {
		
		var id = crypto.randomBytes(length).toString('hex').substr(0,length);
		
		adapter.connection(function (error,connection) {
			
			if (error) {
				
				console.error(error);
				
				return reject(error);
				
			} else {
				
				var query = Sql.select().from(adapter.table).where(key,id);
				
				query.build();
				
				return connection.query(query.formatted,function (error,results) {
					
					connection.release();
					
					if (error) {
						
						console.error(error);
						
						return reject(error);
						
					} else {
						
						if (results.length === 0) {
							
							return resolve(id);
							
						}
						
						return resolve(null);
						
					}
					
				});
				
			}
			
		});
		
	});
	
	return promise.then(function (id) {
		
		if (null === id) {
			
			return adapter.createId(length,key);
			
		}
		
		return id;
		
	});
	
};

Mysql.prototype.createPrimary = function createPrimary(model) {
	
	var adapter = this;
	
	if (this.idLength) {
		
		var promises = [];
		
		this.primary.forEach(function (key) {
			
			promises.push(adapter.createId(this.idLength,key).then(function (id) {
				
				model[key] = id;
				
				return true;
				
			}));
			
		});
		
		return Promise.all(promises).then(function () {
			
			return model;
			
		});
		
	}
	
	return Promise.resolve(model);
	
};

Mysql.prototype.delete = function (model) {
	
	return this._delete(this.getPrimary(model)).then(function (result) {
		
		if (!result.affectedRows) {
			
			throw new Exceptions.NotDeleted();
			
		}
		
		model._deleted = true;
		
		return model;
		
	});
	
};

Mysql.prototype.fetch = function fetch(where,offset,limit) {
	
	var adapter = this;
	
	return new Promise(function (resolve,reject) {
		
		return adapter.connection(function (error,connection) {
			
			if (error) {
				
				//console.error('mysql-adapter.fetch error',error,error.stack);
				
				return reject(error);
				
			} else {
				
				var query = Sql.select().from(adapter.table);
				
				if (where) {
					
					query.where(where);
					
				}
				
				if (offset) {
					
					query.offset(offset);
					
				}
				
				if (limit) {
					
					query.limit(limit);
					
				}
				
				query.build();
				
				console.log('mysql-adapter.fetch query',query.formatted);
				
				return connection.query(query.formatted,function (error,results) {
					
					connection.release();
					
					if (error) {
						
						//console.error('mysql-adapter.fetch error',error,error.stack);
						
						return reject(error);
						
					} else {
						
						//console.log('mysql-adapter.fetch results',results);
						
						return resolve(results);
						
					}
					
				});
				
			}
			
		});
		
	});
	
};

Mysql.prototype.insert = function insert(model) {
	
	var adapter = this;
	
	return this.createPrimary(model).then(function (model) {
		
		return adapter._insert(model).then(function (result) {
			
			if (!result.affectedRows) {
				
				throw new Exceptions.NotInserted();
				
			}
			
			model._added = true;
			
			return model;
			
		});
		
	});
	
};

Mysql.prototype.update = function update(model) {
	
	return this._update(model,this.getPrimary(model)).then(function (result) {
		
		if (!result.affectedRows) {
			
			throw new Exceptions.NotUpdated();
			
		}
		
		model._saved = true;
		
		return model;
		
	});
	
};

Mysql.prototype.getPrimary = function getPrimary(model) {
	
	var primary = {};
	
	this.primary.forEach(function (key) {
		
		primary[key] = model[key];
		
	});
	
	return primary;
	
};

Mysql.prototype._delete = function _delete(where) {
	
	var adapter = this;
	
	return new Promise(function (resolve,reject) {
		
		return adapter.connection(function (error,connection) {
			
			if (error) {
				
				//console.error('mysql-adapter._delete error',error,error.stack);
				
				return reject(error);
				
			} else {
				
				var query = Sql.delete().from(adapter.table);
				
				if (where) {
					
					query.where(where);
					
				}
				
				query.build();
				
				console.log('mysql-adapter._delete query',query.formatted);
				
				return connection.query(query.formatted,function (error,result) {
					
					connection.release();
					
					if (error) {
						
						//console.error('mysql-adapter._delete error',error,error.stack);
						
						return reject(error);
						
					} else {
						
						return resolve(result);
						
					}
					
				});
				
			}
			
		});
		
	});
	
};

Mysql.prototype._insert = function _insert(data) {
	
	var adapter = this;
	
	return new Promise(function (resolve,reject) {
		
		return adapter.connection(function (error,connection) {
			
			if (error) {
				
				//console.error('mysql-adapter._insert error',error,error.stack);
				
				return reject(error);
				
			} else {
				
				var query = Sql.insert().into(adapter.table).set(data);
				
				query.build();
				
				console.log('mysql-adapter._insert query',query.formatted);
				
				return connection.query(query.formatted,function (error,result) {
					
					connection.release();
					
					if (error) {
						
						//console.error('mysql-adapter._insert error',error,error.stack);
						
						return reject(error);
						
					} else {
						
						return resolve(result);
						
					}
					
				});
				
			}
			
		});
		
	});
	
};

Mysql.prototype._update = function _update(data,where) {
	
	var adapter = this;
	
	return new Promise(function (resolve,reject) {
		
		return adapter.connection(function (error,connection) {
			
			if (error) {
				
				//console.error('mysql-adapter._update error',error,error.stack);
				
				return reject(error);
				
			} else {
				
				var query = Sql.update().table(adapter.table).set(data);
				
				if (where) {
					
					query.where(where);
					
				}
				
				query.build();
				
				console.log('mysql-adapter._update query',query.formatted);
				
				return connection.query(query.formatted,function (error,result) {
					
					connection.release();
					
					if (error) {
						
						//console.error('mysql-adapter._update error',error,error.stack);
						
						return reject(error);
						
					} else {
						
						return resolve(result);
						
					}
					
				});
				
			}
			
		});
		
	});
	
};

module.exports = Mysql;