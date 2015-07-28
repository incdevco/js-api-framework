var base = process.env.PWD;
var Framework = require( + "/framework");

describe("Framework.Sql.Select", function () {
  "use strict";

  it("should call call select on the correct formatter", function (done) {

    var format = "postgresql",
      mock = new Framework.Mock(),
      select = new Framework.Sql.Select();

    mock.mock("formatter", select.formatters[format], "select")
      .return({
        inserts: ["inserts"],
        sql: "sql"
      });

    select.build(format);

    Framework.Expect(select.sql).to.be.equal("sql");
    Framework.Expect(select.inserts).to.be.eql(["inserts"]);

    mock.done(done);

  });

});
