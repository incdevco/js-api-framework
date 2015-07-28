var util = require('util');

function NoDelete(result) {

  Error.call(this,'No Delete');

  this.result = result;

}

util.inherits(NoDelete,Error);

module.exports = NoDelete;
