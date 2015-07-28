var base = process.env.PWD;
var Framework = require(base + "/framework");

describe("Framework.Postgresql.Transaction", function () {
  "use strict";

  it("commit", function (done) {

    var expected = "commit",
      mock = new Framework.Mock(),
      transaction = new Framework.Postgresql.Transaction();

    mock.mock("transaction", transaction, "query")
      .with("COMMIT")
      .resolve(expected);

    transaction.commit()
      .then(function (actual) {

        Framework.Expect(actual).to.be.equal(expected);

        return mock.done(done);

      })
      .catch(done);

  });

  it("delete", function (done) {

    var expected = "commit",
      mock = new Framework.Mock(),
      transaction = new Framework.Postgresql.Transaction();

    mock.mock("transaction", transaction, "query")
      .with("DELETE FROM \"table\" WHERE \"id\" = $1", [
        "id"
      ])
      .resolve(expected);

    transaction.delete("table", {
      id: {
        comparator: "=",
        value: "id"
      }
    })
      .then(function (actual) {

        Framework.Expect(actual).to.be.equal(expected);

        return mock.done(done);

      })
      .catch(done);

  });

  it("insert", function (done) {

    var expected = "commit",
      mock = new Framework.Mock(),
      transaction = new Framework.Postgresql.Transaction();

    mock.mock("transaction", transaction, "query")
      .with("INSERT INTO \"table\" (\"id\") VALUES ($1)", [
        "id"
      ])
      .resolve(expected);

    transaction.insert("table", {
      id: "id"
    })
      .then(function (actual) {

        Framework.Expect(actual).to.be.equal(expected);

        return mock.done(done);

      })
      .catch(done);

  });

  it("query", function (done) {

    var client = {},
      expected = "query",
      mock = new Framework.Mock(),
      transaction = new Framework.Postgresql.Transaction(client);

    mock.mock("client", transaction.client, "query")
      .with("sql", "inserts")
      .callback(undefined, expected);

    transaction.query("sql", "inserts")
      .then(function (actual) {

        Framework.Expect(actual).to.be.equal(expected);

        return mock.done(done);

      })
      .catch(done);

  });

  it("query rejects", function (done) {

    var client = {},
      expected = "query",
      mock = new Framework.Mock(),
      transaction = new Framework.Postgresql.Transaction(client);

    mock.mock("client", transaction.client, "query")
      .with("sql", "inserts")
      .callback(expected);

    transaction.query("sql", "inserts")
      .then(function () {

        throw new Error("resolved");

      }, function (actual) {

        Framework.Expect(actual).to.be.equal(expected);

        return mock.done(done);

      })
      .catch(done);

  });

  it("rollback", function (done) {

    var expected = "rollback",
      mock = new Framework.Mock(),
      transaction = new Framework.Postgresql.Transaction();

    mock.mock("transaction", transaction, "query")
      .with("ROLLBACK")
      .resolve(expected);

    transaction.rollback()
      .then(function (actual) {

        Framework.Expect(actual).to.be.equal(expected);

        return mock.done(done);

      })
      .catch(done);

  });

  it("select", function (done) {

    var expected = "select",
      mock = new Framework.Mock(),
      transaction = new Framework.Postgresql.Transaction();

    mock.mock("transaction", transaction, "query")
      .with("SELECT * FROM \"table\" WHERE \"id\" = $1", [
        "id"
      ])
      .resolve(expected);

    transaction.select("table", {
      id: {
        comparator: "=",
        value: "id"
      }
    })
      .then(function (actual) {

        Framework.Expect(actual).to.be.equal(expected);

        return mock.done(done);

      })
      .catch(done);

  });

  it("start", function (done) {

    var expected = "start",
      mock = new Framework.Mock(),
      transaction = new Framework.Postgresql.Transaction();

    mock.mock("transaction", transaction, "query")
      .with("BEGIN")
      .resolve(expected);

    transaction.start()
      .then(function (actual) {

        Framework.Expect(transaction.started).to.be.ok();
        Framework.Expect(actual).to.be.equal(expected);

        return mock.done(done);

      })
      .catch(done);

  });

});
