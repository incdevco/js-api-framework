/* istanbul ignore next */
var env = process.env.NODE_ENV || 'production';
var crypto = require('crypto');

var Errors = require('../errors');
var Expect = require('../expect');
var Promise = require('../promise');

var commaRegex = /,$/;
var commaSpaceRegex = /,\s$/;
var spaceAndRegex = /\sAND$/;

function Adapter(config) {

	Expect(config).to.be.an('object','config');

	Expect(config.pool).to.be.an('object','config.pool');

	Expect(config.primary).to.be.instanceof(Array,'config.primary');

	Expect(config.table).to.be.a('string','config.table');

	if (config.createPrimary) {

		Expect(config.primary.length).to.equal(1,'config.primary.length');

		Expect(config.primaryLength).to.be.a('number','config.primaryLength');

	}

	this.createPrimary = config.createPrimary || false;
	this.pool = config.pool;
	this.primary = config.primary;
	this.primaryLength = config.primaryLength;
	this.table = config.table;

}

Adapter.prototype.add = function add(model) {

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

			var sql = 'INSERT INTO "'+adapter.table+'" ',
				columnString = '',
				valueString = ''
				values = [];

			Object.keys(model).forEach(function (key,index) {

				columnString += '"'+key+'",';

				valueString += '$'+(index+1)+',';

				values.push(model[key]);

			});

			columnString = columnString.replace(commaRegex,'');

			valueString = valueString.replace(commaRegex,'');

			sql += '('+columnString+') VALUES ('+valueString+')';

			return adapter.query(sql,values);

		})
		.then(function (result) {

			if (result.rowCount) {

				return model;

			}

			throw new Errors.NoInsert(result);

		});

};

Adapter.prototype.createPrimaryId = function createPrimaryId() {

	var adapter = this,
		key = this.primary[0],
		primary = crypto.randomBytes(this.primaryLength)
      .toString('hex')
      .substr(0,this.primaryLength),
		where = {};

	where[key] = primary;

	return this.fetchOne(where)
		.then(function () {

			return adapter.createPrimaryId();

		})
		.catch(Errors.NotFound,function () {

			return primary;

		});

};

Adapter.prototype.delete = function _delete(model) {

	var inserts = [],
		primary = this.primary,
		sql = 'DELETE FROM "'+this.table+'" WHERE';

	Object.keys(primary).forEach(function (key,index) {

		sql += ' "'+primary[key]+'" = $'+(index+1)+' AND';

		inserts.push(model[primary[key]]);

	});

	sql = sql.replace(spaceAndRegex,'');

	//sql += ' LIMIT 1';

	return this.query(sql,inserts)
		.then(function (result) {

			if (result.rowCount) {

				return model;

			}

			throw new Errors.NoDelete(result);

		});

};

Adapter.prototype.edit = function edit(oldModel,newModel) {

	var inserts = [],
		insertsIndex = 1,
		primary = this.primary,
		sql = 'UPDATE "'+this.table+'" SET ';

	Object.keys(newModel).forEach(function (key,index) {

		if (oldModel[key] !== newModel[key]) {

			sql += '"'+key+'" = $'+(insertsIndex++)+', ';

			inserts.push(newModel[key]);

		}

	});

	sql = sql.replace(commaSpaceRegex,'');

	sql += ' WHERE';

	Object.keys(primary).forEach(function (key,index) {

		sql += ' "'+primary[key]+'" = $'+(insertsIndex++)+' AND';

		inserts.push(oldModel[primary[key]]);

	});

	sql = sql.replace(spaceAndRegex,'');

	//sql += ' LIMIT 1';

	return this.query(sql,inserts)
		.then(function (result) {

			if (result.rowCount) {

				return newModel;

			}

			throw new Errors.NoUpdate(result);

		});

};

Adapter.prototype.fetchAll = function fetchAll(where,limit,offset,returnQuery) {

	var inserts = [],
		sql = 'SELECT * FROM "'+this.table+'"',
		whereKeys;

	if (where) {

		whereKeys = Object.keys(where);

		if (whereKeys.length) {

			sql += ' WHERE';

			whereKeys.forEach(function (key,index) {

				if (typeof where[key] === 'object') {

					sql += ' "'+key+'" '+where[key].comparator+' $'+(index+1)+' AND';

					inserts.push(where[key].value);

				} else {

					sql += ' "'+key+'" = $'+(index+1)+' AND';

					inserts.push(where[key]);

				}

			});

			sql = sql.replace(spaceAndRegex,'');

		}

	}

	if (limit) {

		sql += ' LIMIT '+parseInt(limit);

	}

	if (offset) {

		sql += ' OFFSET '+parseInt(offset);

	}

	return this.query(sql,inserts,returnQuery)
		.then(function (result) {

			if (returnQuery) {

				return result;

			} else {

				return result.rows;

			}

		});

};

Adapter.prototype.fetchOne = function (where,offset) {

	var inserts = [],
		sql = 'SELECT * FROM "'+this.table+'"',
		whereKeys;

	if (where) {

		whereKeys = Object.keys(where);

		if (whereKeys.length) {

			sql += ' WHERE';

			whereKeys.forEach(function (key,index) {

				if (typeof where[key] === 'object') {

					sql += ' "'+key+'" '+where[key].comparator+' $'+(index+1)+' AND';

					inserts.push(where[key].value);

				} else {

					sql += ' "'+key+'" = $'+(index+1)+' AND';

					inserts.push(where[key]);

				}

			});

			sql = sql.replace(spaceAndRegex,'');

		}

	}

	sql += ' LIMIT 1';

	if (offset) {

		sql += ' OFFSET '+parseInt(offset);

	}

	return this.query(sql,inserts)
		.then(function (result) {

			if (result.rowCount) {

				return result.rows[0];

			}

			throw new Errors.NotFound();

		});

};

Adapter.prototype.query = function query(sql,inserts,returnQuery) {

	var pool = this.pool;

	return new Promise(function (resolve,reject) {

		return pool.connect(function (error,connection,done) {

			if  (error) {

				return reject(error);

			}

			var query;

			if (returnQuery) {

				query = connection.query({
					text: sql,
					values: inserts
				});

			} else {

				query = connection.query(sql,inserts,function (error,result) {

					done();

					if (error) {

						return reject(error);

					}

					return resolve(result);

				});

			}

			/* istanbul ignore else */
			if (env !== 'production') {

				console.log('Adapter.query',query);

			}

			if (returnQuery) {

				query.on('end',function () {

					done();

				});

				return resolve(query);

			}

		});

	});

};

module.exports = Adapter;
