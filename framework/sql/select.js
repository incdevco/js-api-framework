var formatters = require("./formatters");

function Select() {
  "use strict";

  this.columns = "*";

  this.formatters = formatters;

  this.forUpdate = null;

  this.inserts = null;

  this.limit = null;

  this.offset = null;

  this.sql = null;

  this.table = null;

  this.where = null;

}

Select.prototype.build = function build(format) {
  "use strict";

  var result = this.formatters[format].select(this);

  this.inserts = result.inserts;

  this.sql = result.sql;

  return this;

};

module.exports = Select;
