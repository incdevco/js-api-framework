var util = require("util");

function AlreadyExists() {
  "use strict";

  Error.call(this);

  this.message = "Already Exists";

}

util.inherits(AlreadyExists, Error);

module.exports = AlreadyExists;
