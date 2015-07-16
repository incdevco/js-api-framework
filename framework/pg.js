module.exports = require("pg");

module.exports.types.setTypeParser(16, function booleanParser(value) {
  "use strict";

  if (value === "t") {

    return true;

  }

  if (value === "f") {

    return false;

  }

  return value;

});

module.exports.types.setTypeParser(20, function bigintegerParser(value) {
  "use strict";

  return parseInt(value);

});

module.exports.types.setTypeParser(1700, function numericParser(value) {
  "use strict";

  return parseFloat(value);

});
