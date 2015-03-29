var util = require('util');

function NotFound() {

  Error.call(this,'Not Found');

}

util.inherits(NotFound,Error);

module.exports = NotFound;
