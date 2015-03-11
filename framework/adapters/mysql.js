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

Mysql.prototype.add = function add(data) {

	return this._insert(data)
		.then(function (result) {

			if (!result.affectedRows) {

				throw new Exceptions.NotInserted();

			}

			return data;

		});

};

Mysql.prototype._bootstrap = function _bootstrap(application) {

	this.pool = application.get('Mysql').Pool;

};

Mysql.prototype.connection = function connection(callback) {

	return this.pool.getConnection(callback);

};

Mysql.prototype.createId = function createId(key,length) {

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

	return promise
		.then(function (id) {

			if (null === id) {

				return adapter.createId(key,length);

			}

			return id;

		});

};

Mysql.prototype.createPrimary = function createPrimary(model) {

	var adapter = this;

	if (this.idLength) {

		var promises = new Array(this.primary.length);

		this.primary.forEach(function (key,index) {

			promises[index] = adapter.createId(key)
				.then(function (id) {

					model[key] = id;

					return true;

				});
			/*
			promises.push(adapter.createId(key,this.idLength)
				.then(function (id) {

					model[key] = id;

					return true;

				}));
			*/
		});

		return Promise.all(promises)
			.then(function () {

				return model;

			});

	}

	return Promise.resolve(model);

};

Mysql.prototype.delete = function (model) {

	return this._delete(this.getPrimary(model))
		.then(function (result) {

			if (!result.affectedRows) {

				throw new Exceptions.NotDeleted();

			}

			model._deleted = true;

			return model;

		});

};

Mysql.prototype.edit = function edit(data) {

	return this._update(data,this.getPrimary(data))
		.then(function (result) {

			if (!result.affectedRows) {

				throw new Exceptions.NotUpdated();

			}

			return data;

		});

};

Mysql.prototype.fetchAll = function fetchAll(where,limit,offset) {

	return this._fetch(where,limit,offset);

};

Mysql.prototype.fetchOne = function fetchOne(where) {

	return this._fetch(where,1,undefined);

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

Mysql.prototype._fetch = function _fetch(where,limit,offset) {

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

						//console.log('mysql-adapter.fetch results',query.formatted,results);

						return resolve(results);

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
