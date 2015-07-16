var util = require("util");

function NotFound(result) {
  "use strict";

  Error.call(this, "Not Found");

  this.message = "Not Found";

  this.result = result;

}

util.inherits(NotFound, Error);

module.exports = NotFound;
