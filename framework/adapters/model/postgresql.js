var crypto = require("crypto");

var Errors = require("../../errors");
var Expect = require("../../expect");
var Promise = require("../../promise");
var Sql = require("../../sql");
var Transaction = require("../../postgresql/transaction");

function Adapter(config) {
	"use strict";

	Expect(config).to.be.an("object", "config");

	Expect(config.pool).to.be.an("object", "config.pool");

	Expect(config.primary).to.be.instanceof(Array, "config.primary");

	Expect(config.table).to.be.a("string", "config.table");

	if (config.createPrimary) {

		Expect(config.primary.length).to.equal(1, "config.primary.length");

		Expect(config.primaryLength).to.be.a("number", "config.primaryLength");

	}

	this.createPrimary = config.createPrimary || false;
	this.pool = config.pool;
	this.primary = config.primary;
	this.primaryLength = config.primaryLength;
	this.table = config.table;

}

Adapter.prototype.add = function add(model, transaction) {
	"use strict";

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

			var insert = new Sql.Insert();

			insert.table = adapter.table;

			insert.addRow(model);

			insert.build("postgresql");

			if (transaction) {

				return transaction.query(insert.sql, insert.inserts);

			} else {

				return adapter.query(insert.sql, insert.inserts);

			}

		})
		.then(function (result) {

			if (result.rowCount) {

				return model;

			}

			throw new Errors.NoInsert(result);

		});

};

Adapter.prototype.createPrimaryId = function createPrimaryId() {
	"use strict";

	var adapter = this,
		key = this.primary[0],
		primary = crypto.randomBytes(this.primaryLength)
      .toString("hex")
      .substr(0, this.primaryLength),
		where = {};

	where[key] = primary;

	return this.fetchOne(where)
		.then(function () {

			return adapter.createPrimaryId();

		})
		.catch(Errors.NotFound, function () {

			return primary;

		});

};

Adapter.prototype.delete = function (model, transaction) {
	"use strict";

	var del = new Sql.Delete(),
		primary = this.primary,
		promise;

	del.table = this.table;

	del.where = {};

	Object.keys(this.primary).forEach(function (key) {

		del.where[primary[key]] = {
			comparator: "=",
			value: model[primary[key]]
		};

	});

	del.limit = 1;

	del.build("postgresql");

	if (transaction) {

		promise = transaction.query(del.sql, del.inserts);

	} else {

		promise = this.query(del.sql, del.inserts);

	}

	return promise.then(function (result) {

		if (result.rowCount) {

			return model;

		}

		throw new Errors.NoDelete(result);

	});

};

Adapter.prototype.edit = function edit(model, old, transaction) {
	"use strict";

	var primary = this.primary,
		promise,
		update = new Sql.Update();

	update.table = this.table;

	Object.keys(model).forEach(function (key) {

		if (!old || old[key] !== model[key]) {

			update.set[key] = model[key];

		}

	});

	update.where = {};

	Object.keys(this.primary).forEach(function (key) {

		if (old) {

			update.where[primary[key]] = {
				comparator: "=",
				value: old[primary[key]]
			};

		} else {

			update.where[primary[key]] = {
				comparator: "=",
				value: model[primary[key]]
			};

		}

	});

	update.limit = 1;

	update.build("postgresql");

	if (transaction) {

		promise = transaction.query(update.sql, update.inserts);

	} else {

		promise = this.query(update.sql, update.inserts);

	}

	return promise.then(function (result) {

		if (result.rowCount) {

			return model;

		}

		throw new Errors.NoUpdate(result);

	});

};

Adapter.prototype.fetchAll = function fetchAll(where, limit, offset, returnQuery, transaction) {
	"use strict";

	var promise, select = new Sql.Select();

	select.table = this.table;

	if (where) {

		select.where = {};

		Object.keys(where).forEach(function (key) {

			if (typeof where === "object"
				&& where[key].comparator) {

				select.where[key] = where[key];

			} else {

				select.where[key] = {
					comparator: "=",
					value: where[key]
				};

			}

		});

	}

	if (limit) {

		select.limit = parseInt(limit);

	}

	if (offset) {

		select.offset = parseInt(offset);

	}

	select.build("postgresql");

	if (transaction) {

		promise = transaction.query(select.sql, select.inserts, returnQuery);

	} else {

		promise = this.query(select.sql, select.inserts, returnQuery);

	}

	return promise.then(function (result) {

		if (returnQuery) {

			return result;

		}

		return result.rows;

	});

};

Adapter.prototype.fetchOne = function (where, offset, transaction, forUpdate) {
	"use strict";

	var promise, select = new Sql.Select();

	select.table = this.table;

	if (where) {

		select.where = {};

		Object.keys(where).forEach(function (key) {

			if (typeof where === "object"
				&& where[key].comparator) {

				select.where[key] = where[key];

			} else {

				select.where[key] = {
					comparator: "=",
					value: where[key]
				};

			}

		});

	}

	select.limit = 1;

	if (offset) {

		select.offset = offset;

	}

	if (forUpdate) {

		select.forUpdate = true;

	}

	select.build("postgresql");

	if (transaction) {

		promise = transaction.query(select.sql, select.inserts);

	} else {

		promise = this.query(select.sql, select.inserts);

	}

	return promise.then(function (result) {

		if (result.rowCount) {

			return result.rows[0];

		}

		throw new Errors.NotFound(result);

	});

};

Adapter.prototype.query = function (sql, inserts, returnQuery) {
	"use strict";

	var pool = this.pool;

	return new Promise(function (resolve, reject) {

		return pool.connect(function (errorConnection, connection, done) {

			if (errorConnection) {

				return reject(errorConnection);

			}

			var query;

			console.log("query", sql, inserts);

			if (returnQuery) {

				query = connection.query({
					text: sql,
					values: inserts
				});

			} else {

				query = connection.query(sql, inserts, function (error, result) {

					done();

					if (error) {

						return reject(error);

					}

					return resolve(result);

				});

			}

			if (returnQuery) {

				query.on("end", function () {

					done();

				});

				return resolve(query);

			}

		});

	});

};

Adapter.prototype.transaction = function transaction() {
	"use strict";

	var adapter = this;

	return new Promise(function (resolve, reject) {

		return adapter.pool.connect(function (error, client, done) {

			if (error) {

				return reject(error);

			}

			return resolve(new Transaction(client, done));

		});

	});

};

module.exports = Adapter;
