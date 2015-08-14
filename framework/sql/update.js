var formatters = require("./formatters");

function Update() {
  "use strict";

  this.formatters = formatters;

  this.inserts = null;

  this.limit = null;

  this.returning = null;

  this.set = {};

  this.sql = null;

  this.table = null;

  this.where = null;

}

Update.prototype.build = function build(format) {
  "use strict";

  var result = this.formatters[format].update(this);

  this.inserts = result.inserts;

  this.sql = result.sql;

  return this;

};

module.exports = Update;
