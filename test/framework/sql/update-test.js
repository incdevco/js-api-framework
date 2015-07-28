var base = process.env.PWD;
var Framework = require( + "/framework");

describe("Framework.Sql.Update", function () {
  "use strict";

  it("should call call select on the correct formatter", function (done) {

    var format = "postgresql",
      mock = new Framework.Mock(),
      update = new Framework.Sql.Update();

    mock.mock("formatter", update.formatters[format], "update")
      .return({
        inserts: ["inserts"],
        sql: "sql"
      });

      update.build(format);

    Framework.Expect(update.sql).to.be.equal("sql");
    Framework.Expect(update.inserts).to.be.eql(["inserts"]);

    mock.done(done);

  });

});
