var base = process.env.PWD;
var Framework = require(base + "/framework");

describe("Framework.Sql.Insert", function () {
  "use strict";

  it("should call call select on the correct formatter", function (done) {

    var format = "postgresql",
      mock = new Framework.Mock(),
      insert = new Framework.Sql.Insert();

    mock.mock("formatter", insert.formatters[format], "insert")
      .return({
        inserts: ["inserts"],
        sql: "sql"
      });

    insert.build(format);

    Framework.Expect(insert.sql).to.be.equal("sql");
    Framework.Expect(insert.inserts).to.be.eql(["inserts"]);

    mock.done(done);

  });

});
