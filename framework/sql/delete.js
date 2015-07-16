var formatters = require("./formatters");

function Delete() {
  "use strict";

  this.formatters = formatters;

  this.inserts = null;

  this.limit = null;

  this.sql = null;

  this.table = null;

  this.where = null;

}

Delete.prototype.build = function build(format) {
  "use strict";

  var result = this.formatters[format].delete(this);

  this.inserts = result.inserts;

  this.sql = result.sql;

  return this;

};

module.exports = Delete;
