var util = require("util");

function SkipRest() {
  "use strict";

  Error.call(this);

  this.message = "Skip Rest";

}

util.inherits(SkipRest, Error);

module.exports = SkipRest;
