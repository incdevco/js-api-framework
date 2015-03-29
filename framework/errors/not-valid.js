var util = require('util');

function NotValid(errors) {

  Error.call(this,'Not Valid');

  this.errors = errors;

}

util.inherits(NotValid,Error);

module.exports = NotValid;
