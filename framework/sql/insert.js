var formatters = require("./formatters");

function Insert() {
  "use strict";

  this.columns = [];

  this.formatters = formatters;

  this.inserts = null;

  this.returning = null;

  this.sql = null;

  this.table = null;

  this.rows = [];

}

Insert.prototype.build = function build(format) {
  "use strict";

  var result = this.formatters[format].insert(this);

  this.inserts = result.inserts;

  this.sql = result.sql;

  return this;

};

Insert.prototype.addRow = function addRow(row) {
  "use strict";

  var query = this, values = [];

  Object.keys(row).forEach(function (key) {

    query.columns.push(key);

    values.push(row[key]);

  });

  this.rows.push(values);

  return this;

};

module.exports = Insert;
