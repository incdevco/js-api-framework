var util = require('util');

function NotFound() {

  Error.call(this);

  this.message = 'Not Found';

}

util.inherits(NotFound,Error);

module.exports = NotFound;
