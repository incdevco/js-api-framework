var Errors = require("../errors");
var Expect = require("../expect");
var Pg = require("../pg");
var Promise = require("../promise");
var Sql = require("../sql");
var Transaction = require("../postgresql/transaction");

function Postgresql(config) {
  "use strict";

  Expect(config).to.be.an("object", "config");
  Expect(config.data).to.be.a("string", "config.data");

  if (config.host) {

    Expect(config.host).to.be.a("string", "config.host");

  }

  Expect(config.password).to.be.a("string", "config.password");

  if (config.port) {

    Expect(config.port).to.be.a("number", "config.port");

  }

  if (config.ssl) {

    Expect(config.ssl).to.be.a("boolean", "config.ssl");

  }

  Expect(config.user).to.be.a("string", "config.user");

  this.data = config.data;
  this.host = config.host || "localhost";
  this.password = config.password;
  this.pg = config.pg || Pg;
  this.port = config.port || 5432;
  this.ssl = config.ssl || false;
  this.user = config.user;

}

Postgresql.prototype.connect = function connect(config) {
  "use strict";

  var self = this;

  config = config || {};

  config.data = config.data || self.data;
  config.host = config.host || self.host;
  config.password = config.password || self.password;
  config.port = config.port || self.port;
  config.ssl = config.ssl || self.ssl;
  config.user = config.user || self.user;

  return new Promise(function (resolve, reject) {

    return self.pg.connect(config, function (error, connection, done) {

      if (error) {

        return reject(error);

      } else {

        connection.done = done;

        return resolve(connection);

      }

    });

  });

};

Postgresql.prototype.delete = function _delete(table, where) {
  "use strict";

  var query = new Sql.Delete();

  query.table = table;

  query.where = where;

  query.build("postgresql");

  return this.query(query.sql, query.inserts);

};

Postgresql.prototype.fetchAll = function fetchAll(table, where, limit, offset) {
  "use strict";

  var query = new Sql.Select();

  query.table = table;

  query.where = where;

  query.limit = limit;

  query.offset = offset;

  query.build("postgresql");

  return this.query(query.sql, query.inserts)
    .then(function (result) {

      return result.rows;

    });

};

Postgresql.prototype.fetchOne = function fetchOne(table, where, offset) {
  "use strict";

  var query = new Sql.Select();

  query.table = table;

	query.where = where;

  query.limit = 1;

  query.offset = offset;

  query.build("postgresql");

  return this.query(query.sql, query.inserts)
    .then(function (result) {

      return result.rows[0];

    });

};

Postgresql.prototype.insert = function insert(table, rows, returning) {
  "use strict";

  var query = new Sql.Insert();

  query.table = table;

  if (Array.isArray(rows)) {

    rows.forEach(function (row) {

      query.addRow(row);

    });

  } else {

    query.addRow(rows);

  }

  query.returning = returning;

  query.build("postgresql");

  return this.query(query.sql, query.inserts);

};

Postgresql.prototype.query = function query(sql, inserts) {
  "use strict";

  return this.connect()
    .then(function (client) {

      return new Promise(function (resolve, reject) {

        console.log("query", sql, inserts);

        return client.query(sql, inserts, function (error, result) {

          client.done();

          if (error) {

            return reject(error);

          } else {

            return resolve(result);

          }

        });

      });

    });

};

Postgresql.prototype.select = function select(table, where, limit, offset) {
  "use strict";

  var query = new Sql.Select();

  query.table = table;

  query.where = where;

  query.limit = limit;

  query.offset = offset;

  query.build("postgresql");

  return this.query(query.sql, query.inserts);

};

Postgresql.prototype.transaction = function transaction() {
  "use strict";

  return this.connect()
    .then(function (client) {

      return new Transaction(client);

    });

};

Postgresql.prototype.update = function update(table, set, where) {
  "use strict";

  var query = new Sql.Update();

  query.table = table;

  query.set = set;

  query.where = where;

  query.build("postgresql");

  return this.query(query.sql, query.inserts);

};

module.exports = Postgresql;
