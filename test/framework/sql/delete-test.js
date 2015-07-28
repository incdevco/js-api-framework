var base = process.env.PWD;
var Framework = require( + "/framework");

describe("Framework.Sql.Delete", function () {
  "use strict";

  it("should call call select on the correct formatter", function (done) {

    var format = "postgresql",
      mock = new Framework.Mock(),
      del = new Framework.Sql.Delete();

    mock.mock("formatter", del.formatters[format], "delete")
      .return({
        inserts: ["inserts"],
        sql: "sql"
      });

      del.build(format);

    Framework.Expect(del.sql).to.be.equal("sql");
    Framework.Expect(del.inserts).to.be.eql(["inserts"]);

    mock.done(done);

  });

});
