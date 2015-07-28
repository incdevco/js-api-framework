var base = process.env.PWD;

var Framework = require(base + "/framework");

describe("Framework.Adapters.Model.Postgresql", function () {
  "use strict";

  it("constructor", function () {

    var adapter = new Framework.Adapters.Model.Postgresql({
      pool: {},
      primary: ["id"],
      table: "table"
    });

    Framework.Expect(adapter.table).to.be.equal("table");

  });

  it("add resolves when affectedRows", function (done) {

    var adapter = new Framework.Adapters.Model.Postgresql({
        pool: {},
        primary: ["id"],
        table: "table"
      }),
      mock = new Framework.Mock(),
      model = {
        "test": "test"
      };

    mock.mock("adapter", adapter, "query")
      .with("INSERT INTO \"table\" (\"test\") VALUES ($1)", [
        "test"
      ])
      .resolve({
        rowCount: 1
      });

    adapter.add(model)
      .then(function (result) {

        Framework.Expect(result).to.be.eql(model);

        return mock.done(done);

      })
      .catch(done);

  });

  it("add calls createPrimaryId and resolves when createPrimary", function (done) {

    var adapter = new Framework.Adapters.Model.Postgresql({
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
      .with("INSERT INTO \"table\" (\"test\",\"id\") VALUES ($1,$2)", [
        "test",
        "test"
      ])
      .resolve({
        rowCount: 1
      });

    adapter.add(model)
      .then(function (result) {

        Framework.Expect(result).to.be.eql(model);

        return mock.done(done);

      })
      .catch(done);

  });

  it("add rejects when not affectedRows", function (done) {

    var adapter = new Framework.Adapters.Model.Postgresql({
        pool: {},
        primary: ["id"],
        table: "table"
      }),
      mock = new Framework.Mock(),
      model = {
        "test": "test"
      };

    mock.mock("adapter", adapter, "query")
      .with("INSERT INTO \"table\" (\"test\") VALUES ($1)", [
        "test"
      ])
      .resolve({
        rowCount: 0
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

    var adapter = new Framework.Adapters.Model.Postgresql({
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

  it("createPrimaryId calls itself and then resolves when fetchOne resolves and then rejects",function (done) {

    var adapter = new Framework.Adapters.Model.Postgresql({
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

    var adapter = new Framework.Adapters.Model.Postgresql({
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
      .with("DELETE FROM \"table\" WHERE \"id\" = $1 LIMIT 1", [
        "id"
      ])
      .resolve({
        rowCount: 1
      });

    adapter.delete(model)
      .then(function (result) {

        Framework.Expect(result).to.be.eql(model);

        return mock.done(done);

      })
      .catch(done);

  });

  it("delete rejects with NoDelete when no affectedRows", function (done) {

    var adapter = new Framework.Adapters.Model.Postgresql({
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
      .with("DELETE FROM \"table\" WHERE \"id\" = $1 LIMIT 1", [
        "id"
      ])
      .resolve({
        rowCount: 0
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

    var adapter = new Framework.Adapters.Model.Postgresql({
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
      .with("UPDATE \"table\" SET \"test\" = $1 WHERE \"id\" = $2", [
        "tested",
        "id"
      ])
      .resolve({
        rowCount: 1
      });

    adapter.edit(newModel, oldModel)
      .then(function (result) {

        Framework.Expect(result).to.be.eql(newModel);

        return mock.done(done);

      })
      .catch(done);

  });

  it("edit rejects with NoUpdate when no affectedRows", function (done) {

    var adapter = new Framework.Adapters.Model.Postgresql({
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
      .with("UPDATE \"table\" SET \"test\" = $1 WHERE \"id\" = $2", [
        "tested",
        "id"
      ])
      .resolve({
        rowCount: 0
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

    var adapter = new Framework.Adapters.Model.Postgresql({
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
      returnResult = {
        rowCount: 1,
        rows: [{"test": "test"}]
      },
      expected = [{"test": "test"}];

    mock.mock("adapter", adapter, "query")
      .with("SELECT * FROM \"table\" WHERE \"test\" = $1 LIMIT 1 OFFSET 1", [
        "test"
      ])
      .resolve(returnResult);

    adapter.fetchAll(where, limit, offset)
      .then(function (result) {

        Framework.Expect(result).to.be.eql(expected);

        return mock.done(done);

      })
      .catch(done);

  });

  it("fetchAll with where with comparator and value", function (done) {

    var adapter = new Framework.Adapters.Model.Postgresql({
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
      returnResult = {
        rowCount: 1,
        rows: [{"test": "test"}]
      },
      expected = [{"test": "test"}];

    mock.mock("adapter", adapter, "query")
      .with("SELECT * FROM \"table\" WHERE \"test\" > $1 LIMIT 1 OFFSET 1", [
        "test"
      ])
      .resolve(returnResult);

    adapter.fetchAll(where, limit, offset)
      .then(function (result) {

        Framework.Expect(result).to.be.eql(expected);

        return mock.done(done);

      })
      .catch(done);

  });

  it("fetchAll without where, limit or offset resolves", function (done) {

    var adapter = new Framework.Adapters.Model.Postgresql({
        pool: {},
        primary: ["id"],
        table: "table"
      }),
      mock = new Framework.Mock(),
      returnResult = {
        rowCount: 1,
        rows: [{"test": "test"}]
      },
      expected = [{"test": "test"}];

    mock.mock("adapter", adapter, "query")
      .with("SELECT * FROM \"table\"", [])
      .resolve(returnResult);

    adapter.fetchAll()
      .then(function (result) {

        Framework.Expect(result).to.be.eql(expected);

        return mock.done(done);

      })
      .catch(done);

  });

  it("fetchOne with where and offset resolves when result.rowCount", function (done) {

    var adapter = new Framework.Adapters.Model.Postgresql({
        pool: {},
        primary: ["id"],
        table: "table"
      }),
      mock = new Framework.Mock(),
      where = {
        "test": "test"
      },
      offset = 1,
      returnResult = {
        rowCount: 1,
        rows: [{"test": "test"}]
      },
      expected = {"test": "test"};

    mock.mock("adapter", adapter, "query")
      .with("SELECT * FROM \"table\" WHERE \"test\" = $1 LIMIT 1 OFFSET 1", [
        "test"
      ])
      .resolve(returnResult);

    adapter.fetchOne(where, offset)
      .then(function (result) {

        Framework.Expect(result).to.be.eql(expected);

        return mock.done(done);

      })
      .catch(done);

  });

  it("fetchOne with where with comparator and value resolves when result.rowCount", function (done) {

    var adapter = new Framework.Adapters.Model.Postgresql({
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
      returnResult = {
        rowCount: 1,
        rows: [{"test": "test"}]
      },
      expected = {"test": "test"};

    mock.mock("adapter", adapter, "query")
      .with("SELECT * FROM \"table\" WHERE \"test\" > $1 LIMIT 1", [
        "test"
      ])
      .resolve(returnResult);

    adapter.fetchOne(where)
      .then(function (result) {

        Framework.Expect(result).to.be.eql(expected);

        return mock.done(done);

      })
      .catch(done);

  });

  it("fetchOne without where or offset resolves when result.rowCount", function (done) {

    var adapter = new Framework.Adapters.Model.Postgresql({
        pool: {},
        primary: ["id"],
        table: "table"
      }),
      mock = new Framework.Mock(),
    returnResult = {
      rowCount: 1,
      rows: [{"test": "test"}]
    },
    expected = {"test": "test"};

    mock.mock("adapter", adapter, "query")
      .with("SELECT * FROM \"table\" LIMIT 1", [])
      .resolve(returnResult);

    adapter.fetchOne()
      .then(function (result) {

        Framework.Expect(result).to.be.eql(expected);

        return mock.done(done);

      })
      .catch(done);

  });

  it("fetchOne rejects with NotFound when not result.rowCount", function (done) {

    var adapter = new Framework.Adapters.Model.Postgresql({
        pool: {},
        primary: ["id"],
        table: "table"
      }),
      mock = new Framework.Mock(),
      where = {
        "test": "test"
      },
      returnResult = {
        rowCount: 0,
        rows: []
      };

    mock.mock("adapter", adapter, "query")
      .with("SELECT * FROM \"table\" WHERE \"test\" = $1 LIMIT 1", [
        "test"
      ])
      .resolve(returnResult);

    adapter.fetchOne(where)
      .then(function () {

        return done(new Error("resolved"));

      })
      .catch(Framework.Errors.NotFound, function () {

        return mock.done(done);

      })
      .catch(done);

  });

  it("query resolves with result from connection.query", function (done) {

    var adapter = new Framework.Adapters.Model.Postgresql({
        pool: {},
        primary: ["id"],
        table: "test"
      }),
      mock = new Framework.Mock(),
      connection = {},
      finish = {},
      sql = "sql",
      inserts = "inserts",
      expected = "expected";

    mock.mock("finish", finish, "done")
      .return("");

    mock.mock("pool", adapter.pool, "connect")
      .callback(null, connection, finish.done);

    mock.mock("connection", connection, "query")
      .with(sql, inserts)
      .callback(null, expected);

    adapter.query(sql, inserts)
      .then(function (result) {

        Framework.Expect(result).to.be.equal(expected);

        return mock.done(done);

      })
      .catch(done);

  });

  it("query rejects with error from pool.connect", function (done) {

    var adapter = new Framework.Adapters.Model.Postgresql({
        pool: {},
        primary: ["id"],
        table: "test"
      }),
      mock = new Framework.Mock(),
      sql = "sql",
      inserts = "inserts",
      error = "error";

    mock.mock("pool", adapter.pool, "connect")
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

    var adapter = new Framework.Adapters.Model.Postgresql({
        pool: {},
        primary: ["id"],
        table: "test"
      }),
      mock = new Framework.Mock(),
      connection = {},
      finish = {},
      sql = "sql",
      inserts = "inserts",
      error = "error";

    mock.mock("finish", finish, "done")
      .return("");

    mock.mock("pool", adapter.pool, "connect")
      .callback(null, connection, finish.done);

    mock.mock("connection", connection, "query")
      .with(sql, inserts)
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

});
