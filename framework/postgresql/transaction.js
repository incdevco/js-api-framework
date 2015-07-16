var Promise = require("../promise");
var Sql = require("../sql");

function Transaction(client) {
  "use strict";

  this.client = client;
  this.commited = false;
  this.rolledback = false;
  this.started = false;

}

Transaction.prototype.commit = function commit() {
  "use strict";

  var self = this;

  if (this.commited) {

    return Promise.reject(new Error("Already Commited"));

  }

  if (this.rolledback) {

    return Promise.reject(new Error("Already Rolled Back"));

  }

  return this.query("COMMIT")
    .then(function (result) {

      console.log("transaction commited");

      self.commited = true;

      return result;

    });

};

Transaction.prototype.delete = function _delete(table, where) {
  "use strict";

  var query = new Sql.Delete();

  query.table = table;

  query.where = where;

  query.build("postgresql");

  return this.query(query.sql, query.inserts);

};

Transaction.prototype.done = function done() {
  "use strict";

  this.client.done();

  return this;

};

Transaction.prototype.insert = function insert(table, row, returning) {
  "use strict";

  var query = new Sql.Insert();

  query.table = table;

  query.addRow(row);

  if (returning) {

    query.returning = returning;

  }

  query.build("postgresql");

  return this.query(query.sql, query.inserts);

};

Transaction.prototype.query = function query(sql, inserts) {
  "use strict";

  var self = this;

  return new Promise(function (resolve, reject) {

    console.log("query", sql, inserts);

    return self.client.query(sql, inserts, function (error, result) {

      if (error) {

        return reject(error);

      } else {

        return resolve(result);

      }

    });

  });

};

Transaction.prototype.rollback = function rollback() {
  "use strict";

  var self = this;

  if (this.committed) {

    return Promise.reject(new Error("Already Committed"));

  }

  if (this.rolledback) {

    return Promise.reject(new Error("Already Rolled Back"));

  }

  return this.query("ROLLBACK")
    .then(function (result) {

      console.log("transaction rolled back");

      self.rolledback = true;

      return result;

    });

};

Transaction.prototype.select = function select(table, where, limit, offset, forUpdate) {
  "use strict";

  var query = new Sql.Select();

  query.table = table;

  query.where = where;

  query.limit = limit;

  query.offset = offset;

  query.forUpdate = forUpdate;

  query.build("postgresql");

  return this.query(query.sql, query.inserts);

};

Transaction.prototype.start = function start() {
  "use strict";

  var self = this;

  if (this.started) {

    return Promise.reject(new Error("Already Started"));

  }

  return this.query("BEGIN")
    .then(function (result) {

      self.started = true;

      return result;

    });

};

Transaction.prototype.update = function update(table, changes, where) {
  "use strict";

  var query = new Sql.Update();

  query.table = table;

  query.set = changes;

  query.where = where;

  query.build("postgresql");

  return this.query(query.sql, query.inserts);

};

module.exports = Transaction;
