var util = require('util');

function NoUpdate(result) {

  Error.call(this,'No Update');

  this.result = result;

}

util.inherits(NoUpdate,Error);

module.exports = NoUpdate;
