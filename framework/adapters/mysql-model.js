var env = process.env.NODE_ENV || 'development';
var crypto = require('crypto');

var Errors = require('./errors');
var Expect = require('../expect');
var Promise = require('../promise');

var commaSpaceRegex = /,\s$/;
var spaceAndRegex = /\sAND$/;

function MysqlModelAdapter(config) {

	config = config || {};

	Expect(config.pool).to.be.an('object');

	Expect(config.primary).to.be.instanceof(Array);

	Expect(config.table).to.be.a('string');

	if (config.createPrimary) {

		Expect(config.primary.length).to.equal(1);

		Expect(config.primaryLength).to.be.a('number');

	}

	this.createPrimary = config.createPrimary || false;
	this.pool = config.pool;
	this.primary = config.primary;
	this.primaryLength = config.primaryLength;
	this.table = config.table;

}

MysqlModelAdapter.prototype.add = function add(model) {

	var adapter = this, promise;

	if (this.createPrimary) {

		promise = this.createPrimaryId()
			.then(function (primary) {

				model[adapter.primary[0]] = primary;

				return true;

			});

	} else {

		promise = Promise.resolve(true);

	}

	return promise
		.then(function () {

			var inserts = [adapter.table], sql = 'INSERT INTO ?? SET ';

			Object.keys(model).forEach(function (key) {

				sql += '?? = ?, ';

				inserts.push(key);

				inserts.push(model[key]);

			});

			sql = sql.replace(commaSpaceRegex,'');

			return adapter.query(sql,inserts);

		})
		.then(function (result) {

			if (result.affectedRows) {

				return model;

			}

			throw new Errors.NoInsert(result);

		});

};

MysqlModelAdapter.prototype.createPrimaryId = function createPrimaryId() {

	var key = this.primary[0],
		primary = crypto.randomBytes(this.primaryLength)
      .toString('hex')
      .substr(0,this.primaryLength);

	return this.fetchOne({
		key: primary
	})
		.then(function () {

			return adapter.createPrimaryId();

		})
		.catch(Errors.NotFound,function () {

			return primary;

		});

};

/**
 * Will delete only if all fields are still the same
 */
MysqlModelAdapter.prototype.delete = function _delete(model) {

	var inserts = [this.table],
		sql = 'DELETE FROM ?? WHERE';

	Object.keys(model).forEach(function (key) {

		sql += ' ?? = ? AND';

		inserts.push(key);

		inserts.push(model[key]);

	});

	sql = sql.replace(spaceAndRegex,'');

	sql += ' LIMIT 1';

	this.query(sql,inserts)
		.then(function (result) {

			if (result.affectedRows) {

				return model;

			}

			throw new Errors.NoDelete(result);

		});

};

/**
 * Will update only changed fields and
 * only if old fields are still the same
 */
MysqlModelAdapter.prototype.edit = function edit(oldModel,newModel) {

	var inserts = [this.table],
		sql = 'UPDATE ?? SET ';

	Object.keys(newModel).forEach(function (key) {

		if (oldModel[key] !== newModel[key]) {

			sql += '?? = ?, ';

			inserts.push(key);

			inserts.push(newModel[key]);

		}

	});

	sql = sql.replace(commaSpaceRegex,'');

	sql += ' WHERE ';

	Object.keys(oldModel).forEach(function (key) {

		sql += '?? = ? AND';

		inserts.push(key);

		inserts.push(oldModel[key]);

	});

	sql = sql.replace(spaceAndRegex,'');

	sql += ' LIMIT 1';

	return this.query(sql,inserts)
		.then(function (result) {

			if (result.affectedRows) {

				return newModel;

			}

			throw new Errors.NoUpdate(result);

		});

};

MysqlModelAdapter.prototype.fetchAll = function fetchAll(where,limit,offset) {

	var inserts = [this.table],
		sql = 'SELECT * FROM ??';

	if (where) {

		sql += ' WHERE';

		Object.keys(where).forEach(function (key) {

			if (typeof where[key] === 'object') {

				sql += ' ?? '+where[key].comparator+' ? AND';

				inserts.push(key);

				inserts.push(where[key].value);

			} else {

				sql += ' ?? = ? AND';

				inserts.push(key);

				inserts.push(where[key]);

			}

		});

		sql = sql.replace(spaceAndRegex,'');

	}

	if (limit) {

		sql += ' LIMIT ?';

		inserts.push(limit);

	}

	if (offset) {

		sql += ' OFFSET ?';

		inserts.push(offset);

	}

	return this.query(sql,inserts)
		.then(function (result) {

			return result;

		});

};

MysqlModelAdapter.prototype.fetchOne = function (where,offset) {

	var inserts = [this.table], sql = 'SELECT * FROM ??';

	if (where) {

		sql += ' WHERE';

		Object.keys(where).forEach(function (key) {

			if (typeof where[key] === 'object') {

				sql += ' ?? '+where[key].comparator+' ? AND ';

				inserts.push(key);

				inserts.push(where[key].value);

			} else {

				sql += ' ?? = ? AND';

				inserts.push(key);

				inserts.push(where[key]);

			}

		});

		sql = sql.replace(spaceAndRegex,'');

	}

	if (offset) {

		sql += ' OFFSET ?';

		inserts.push(offset);

	}

	return this.query(sql,inserts)
		.then(function (result) {

			if (result.length) {

				return result[0];

			}

			throw new Errors.NotFound();

		});

};

MysqlModelAdapter.prototype.getConnection = function getConnection() {

	var pool = this.pool;

	return new Promise(function (resolve,reject) {

		return pool.getConnection(function (error,connection) {

			if (error) {

				return reject(error);

			}

			return resolve(connection);

		});

	});

};

MysqlModelAdapter.prototype.query = function query(sql,inserts) {

	var pool = this.pool;

	return new Promise(function (resolve,reject) {

		return pool.getConnection(function (error,connection) {

			if  (error) {

				return reject(error);

			}

			var query = connection.query(sql,inserts,function (error,result) {

				connection.release();

				if (error) {

					return reject(error);

				}

				return resolve(result);

			});

			if (env !== 'production') {

				console.log('MysqlAdapter.query',query);

			}

		});

	});

};

module.exports = MysqlModelAdapter;
