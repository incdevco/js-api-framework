var util = require("util");

function NotValid(errors) {
  "use strict";

  Error.call(this);
  Error.captureStackTrace(this, this.constructor);

  this.name = this.constructor.name;
  this.errors = errors;

}

util.inherits(NotValid, Error);

module.exports = NotValid;
