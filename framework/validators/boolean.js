var NotValid = require("../errors").NotValid;
var Promise = require("../promise");

function BooleanValidator(config) {
  "use strict";

  config = config || {};

}

BooleanValidator.prototype.validate = function validate(value) {
  "use strict";

  if (typeof value !== "boolean") {

    return Promise.reject(new NotValid("Must Be A Boolean"));

  }

  return Promise.resolve(value);

};

module.exports = BooleanValidator;
