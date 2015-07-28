var base = process.env.PWD;

var Framework = require( + "/framework");

describe("Framework.Adapters.Model.Mysql", function () {
  "use strict";

  it("constructor", function () {

    var adapter = new Framework.Adapters.Model.Mysql({
      pool: {},
      primary: ["id"],
      table: "table"
    });

    Framework.Expect(adapter.table).to.be.equal("table");

  });

  it("add resolves when affectedRows", function (done) {

    var adapter = new Framework.Adapters.Model.Mysql({
        pool: {},
        primary: ["id"],
        table: "table"
      }),
      mock = new Framework.Mock(),
      model = {
        "test": "test"
      };

    mock.mock("adapter", adapter, "query")
      .with("INSERT INTO ?? SET ?? = ?", [
        adapter.table,
        "test",
        "test"
      ])
      .resolve({
        affectedRows: 1
      });

    adapter.add(model)
      .then(function (result) {

        Framework.Expect(result).to.be.eql(model);

        return mock.done(done);

      })
      .catch(done);

  });

  it("add calls createPrimaryId and resolves when createPrimary", function (done) {

    var adapter = new Framework.Adapters.Model.Mysql({
        createPrimary: true,
        pool: {},
        primary: ["id"],
        primaryLength: 10,
        table: "table"
      }),
      mock = new Framework.Mock(),
      model = {
        "test": "test"
      };

    mock.mock("adapter", adapter, "createPrimaryId")
      .resolve("test");

    mock.mock("adapter", adapter, "query")
      .with("INSERT INTO ?? SET ?? = ?, ?? = ?", [
        adapter.table,
        "test",
        "test",
        "id",
        "test"
      ])
      .resolve({
        affectedRows: 1
      });

    adapter.add(model)
      .then(function (result) {

        Framework.Expect(result).to.be.eql(model);

        return mock.done(done);

      })
      .catch(done);

  });

  it("add rejects when not affectedRows", function (done) {

    var adapter = new Framework.Adapters.Model.Mysql({
        pool: {},
        primary: ["id"],
        table: "table"
      }),
      mock = new Framework.Mock(),
      model = {
        "test": "test"
      };

    mock.mock("adapter", adapter, "query")
      .with("INSERT INTO ?? SET ?? = ?", [
        adapter.table,
        "test",
        "test"
      ])
      .resolve({
        affectedRows: 0
      });

    adapter.add(model)
      .then(function () {

        return done(new Error("resolved"));

      })
      .catch(Framework.Errors.NoInsert, function (error) {

        return done();

      })
      .catch(done);

  });

  it("createPrimaryId resolves when fetchOne rejects with NotFound", function (done) {

    var adapter = new Framework.Adapters.Model.Mysql({
        pool: {},
        primary: ["id"],
        primaryLength: 10,
        table: "table"
      }),
      mock = new Framework.Mock();

    mock.mock("adapter", adapter, "fetchOne")
      .reject(new Framework.Errors.NotFound());

    adapter.createPrimaryId()
      .then(function (result) {

        Framework.Expect(result).to.be.a("string");
        Framework.Expect(result.length).to.be.equal(10);

        return mock.done(done);

      })
      .catch(done);

  });

  it("createPrimaryId calls itself and then resolves"
    + " when fetchOne resolves and then rejects", function (done) {

    var adapter = new Framework.Adapters.Model.Mysql({
        pool: {},
        primary: ["id"],
        primaryLength: 10,
        table: "table"
      }),
      mock = new Framework.Mock();

    mock.mock("adapter", adapter, "fetchOne")
      .resolve({});

    mock.mock("adapter", adapter, "fetchOne")
      .reject(new Framework.Errors.NotFound());

    adapter.createPrimaryId()
      .then(function (result) {

        Framework.Expect(result).to.be.a("string");
        Framework.Expect(result.length).to.be.equal(10);

        return mock.done(done);

      })
      .catch(done);

  });

  it("delete resolves when affectedRows", function (done) {

    var adapter = new Framework.Adapters.Model.Mysql({
        pool: {},
        primary: ["id"],
        table: "table"
      }),
      mock = new Framework.Mock(),
      model = {
        "id": "id",
        "test": "test"
      };

    mock.mock("adapter", adapter, "query")
      .with("DELETE FROM ?? WHERE ?? = ? LIMIT 1", [
        adapter.table,
        "id",
        "id"
      ])
      .resolve({
        affectedRows: 1
      });

    adapter.delete(model)
      .then(function (result) {

        Framework.Expect(result).to.be.eql(model);

        return mock.done(done);

      })
      .catch(done);

  });

  it("delete rejects with NoDelete when no affectedRows", function (done) {

    var adapter = new Framework.Adapters.Model.Mysql({
        pool: {},
        primary: ["id"],
        table: "table"
      }),
      mock = new Framework.Mock(),
      model = {
        "id": "id",
        "test": "test"
      };

    mock.mock("adapter", adapter, "query")
      .with("DELETE FROM ?? WHERE ?? = ? LIMIT 1", [
        adapter.table,
        "id",
        "id"
      ])
      .resolve({
        affectedRows: 0
      });

    adapter.delete(model)
      .then(function () {

        return done(new Error("resolved"));

      })
      .catch(Framework.Errors.NoDelete, function () {

        return mock.done(done);

      })
      .catch(done);

  });

  it("edit resolves when affectedRows", function (done) {

    var adapter = new Framework.Adapters.Model.Mysql({
        pool: {},
        primary: ["id"],
        table: "table"
      }),
      mock = new Framework.Mock(),
      oldModel = {
        "id": "id",
        "test": "test",
        "same": "same"
      },
      newModel = {
        "id": "id",
        "test": "tested",
        "same": "same"
      };

    mock.mock("adapter", adapter, "query")
      .with("UPDATE ?? SET ?? = ? WHERE ?? = ? LIMIT 1", [
        adapter.table,
        "test",
        "tested",
        "id",
        "id"
      ])
      .resolve({
        affectedRows: 1
      });

    adapter.edit(newModel, oldModel)
      .then(function (result) {

        Framework.Expect(result).to.be.eql(newModel);

        return mock.done(done);

      })
      .catch(done);

  });

  it("edit rejects with NoUpdate when no affectedRows",function (done) {

    var adapter = new Framework.Adapters.Model.Mysql({
        pool: {},
        primary: ["id"],
        table: "table"
      }),
      mock = new Framework.Mock(),
      oldModel = {
        "id": "id",
        "test": "test"
      },
      newModel = {
        "id": "id",
        "test": "tested"
      };

    mock.mock("adapter", adapter, "query")
      .with("UPDATE ?? SET ?? = ? WHERE ?? = ? LIMIT 1", [
        adapter.table,
        "test",
        "tested",
        "id",
        "id"
      ])
      .resolve({
        affectedRows: 0
      });

    adapter.edit(newModel, oldModel)
      .then(function () {

        return done(new Error("resolved"));

      })
      .catch(Framework.Errors.NoUpdate, function () {

        return mock.done(done);

      })
      .catch(done);

  });

  it("fetchAll with where, limit and offset resolves", function (done) {

    var adapter = new Framework.Adapters.Model.Mysql({
        pool: {},
        primary: ["id"],
        table: "table"
      }),
      mock = new Framework.Mock(),
      where = {
        "test": "test"
      },
      limit = 1,
      offset = 1,
      expected = [{"test": "test"}];

    mock.mock("adapter", adapter, "query")
      .with("SELECT * FROM ?? WHERE ?? = ? LIMIT ? OFFSET ?", [
        adapter.table,
        "test",
        "test",
        limit,
        offset
      ])
      .resolve(expected);

    adapter.fetchAll(where, limit, offset)
      .then(function (result) {

        Framework.Expect(result).to.be.eql(expected);

        return mock.done(done);

      })
      .catch(done);

  });

  it("fetchAll with where with comparator and value", function (done) {

    var adapter = new Framework.Adapters.Model.Mysql({
        pool: {},
        primary: ["id"],
        table: "table"
      }),
      mock = new Framework.Mock(),
      where = {
        "test": {
          comparator: ">",
          value: "test"
        }
      },
      limit = 1,
      offset = 1,
      expected = [{"test": "test"}];

    mock.mock("adapter", adapter, "query")
      .with("SELECT * FROM ?? WHERE ?? > ? LIMIT ? OFFSET ?", [
        adapter.table,
        "test",
        "test",
        limit,
        offset
      ])
      .resolve(expected);

    adapter.fetchAll(where, limit, offset)
      .then(function (result) {

        Framework.Expect(result).to.be.eql(expected);

        return mock.done(done);

      })
      .catch(done);

  });

  it("fetchAll without where, limit or offset resolves", function (done) {

    var adapter = new Framework.Adapters.Model.Mysql({
        pool: {},
        primary: ["id"],
        table: "table"
      }),
      mock = new Framework.Mock(),
      expected = [{"test": "test"}];

    mock.mock("adapter", adapter, "query")
      .with("SELECT * FROM ??", [
        adapter.table
      ])
      .resolve(expected);

    adapter.fetchAll()
      .then(function (result) {

        Framework.Expect(result).to.be.eql(expected);

        return mock.done(done);

      })
      .catch(done);

  });

  it("fetchOne with where and offset resolves when result[0]", function (done) {

    var adapter = new Framework.Adapters.Model.Mysql({
        pool: {},
        primary: ["id"],
        table: "table"
      }),
      mock = new Framework.Mock(),
      where = {
        "test": "test"
      },
      offset = 1,
      expected = [{"test": "test"}];

    mock.mock("adapter", adapter, "query")
      .with("SELECT * FROM ?? WHERE ?? = ? LIMIT 1 OFFSET ?", [
        adapter.table,
        "test",
        "test",
        offset
      ])
      .resolve(expected);

    adapter.fetchOne(where, offset)
      .then(function (result) {

        Framework.Expect(result).to.be.eql(expected[0]);

        return mock.done(done);

      })
      .catch(done);

  });

  it("fetchOne with where with comparator"
    + " and value resolves when result[0]", function (done) {

    var adapter = new Framework.Adapters.Model.Mysql({
        pool: {},
        primary: ["id"],
        table: "table"
      }),
      mock = new Framework.Mock(),
      where = {
        "test": {
          comparator: ">",
          value: "test"
        }
      },
      expected = [{"test": "test"}];

    mock.mock("adapter", adapter, "query")
      .with("SELECT * FROM ?? WHERE ?? > ? LIMIT 1", [
        adapter.table,
        "test",
        "test"
      ])
      .resolve(expected);

    adapter.fetchOne(where)
      .then(function (result) {

        Framework.Expect(result).to.be.eql(expected[0]);

        return mock.done(done);

      })
      .catch(done);

  });

  it("fetchOne without where or offset resolves when result[0]", function (done) {

    var adapter = new Framework.Adapters.Model.Mysql({
        pool: {},
        primary: ["id"],
        table: "table"
      }),
      mock = new Framework.Mock(),
    expected = [{"test": "test"}];

    mock.mock("adapter", adapter, "query")
      .with("SELECT * FROM ?? LIMIT 1", [
        adapter.table
      ])
      .resolve(expected);

    adapter.fetchOne()
      .then(function (result) {

        Framework.Expect(result).to.be.eql(expected[0]);

        return mock.done(done);

      })
      .catch(done);

  });

  it("fetchOne rejects with NotFound when not result[0]", function (done) {

    var adapter = new Framework.Adapters.Model.Mysql({
        pool: {},
        primary: ["id"],
        table: "table"
      }),
      mock = new Framework.Mock(),
      where = {
        "test": "test"
      },
      expected = [];

    mock.mock("adapter", adapter, "query")
      .with("SELECT * FROM ?? WHERE ?? = ? LIMIT 1", [
        adapter.table,
        "test",
        "test"
      ])
      .resolve(expected);

    adapter.fetchOne(where)
      .then(function () {

        return done(new Error("resolved"));

      })
      .catch(Framework.Errors.NotFound, function () {

        return mock.done(done);

      })
      .catch(done);

  });

  it("getConnection resolves with connection", function (done) {

    var adapter = new Framework.Adapters.Model.Mysql({
        pool: {},
        primary: ["id"],
        table: "test"
      }),
      mock = new Framework.Mock(),
      connection = "test";

    mock.mock("pool", adapter.pool, "getConnection")
      .callback(null, connection);

    adapter.getConnection()
      .then(function (result) {

        Framework.Expect(result).to.be.equal(connection);

        return mock.done(done);

      })
      .catch(done);

  });

  it("getConnection rejects with error", function (done) {

    var adapter = new Framework.Adapters.Model.Mysql({
        pool: {},
        primary: ["id"],
        table: "test"
      }),
      mock = new Framework.Mock(),
      error = "error";

    mock.mock("pool", adapter.pool, "getConnection")
      .callback(error);

    adapter.getConnection()
      .then(function () {

        return done(new Error("resolved"));

      })
      .catch(function (result) {

        Framework.Expect(result).to.be.equal(error);

        return mock.done(done);

      });

  });

  it("query resolves with result from connection.query", function (done) {

    var adapter = new Framework.Adapters.Model.Mysql({
        pool: {},
        primary: ["id"],
        table: "test"
      }),
      mock = new Framework.Mock(),
      connection = {},
      sql = "sql",
      inserts = "inserts",
      expected = "expected";

    mock.mock("pool", adapter.pool, "getConnection")
      .callback(null, connection);

    mock.mock("connection", connection, "query")
      .with(sql, inserts)
      .callback(null, expected);

    mock.mock("connection", connection, "release")
      .return("");

    adapter.query(sql, inserts)
      .then(function (result) {

        Framework.Expect(result).to.be.equal(expected);

        return mock.done(done);

      })
      .catch(done);

  });

  it("query rejects with error from pool.getConnection", function (done) {

    var adapter = new Framework.Adapters.Model.Mysql({
        pool: {},
        primary: ["id"],
        table: "test"
      }),
      mock = new Framework.Mock(),
      sql = "sql",
      inserts = "inserts",
      error = "error";

    mock.mock("pool", adapter.pool, "getConnection")
      .callback(error);

    adapter.query(sql, inserts)
      .then(function () {

        return done(new Error("resolved"));

      })
      .catch(function (result) {

        Framework.Expect(result).to.be.equal(error);

        return mock.done(done);

      })
      .catch(done);

  });

  it("query rejects with error from connection.query", function (done) {

    var adapter = new Framework.Adapters.Model.Mysql({
        pool: {},
        primary: ["id"],
        table: "test"
      }),
      mock = new Framework.Mock(),
      connection = {},
      sql = "sql",
      inserts = "inserts",
      error = "error";

    mock.mock("pool", adapter.pool, "getConnection")
      .callback(null, connection);

    mock.mock("connection", connection, "query")
      .with(sql, inserts)
      .callback(error);

    mock.mock("connection", connection, "release")
      .return("");

    adapter.query(sql, inserts)
      .then(function () {

        return done(new Error("resolved"));

      })
      .catch(function (result) {

        Framework.Expect(result).to.be.equal(error);

        return mock.done(done);

      })
      .catch(done);

  });

});
