var util = require('util');

function NoInsert(result) {

  Error.call(this,'No Insert');

  this.result = result;

}

util.inherits(NoInsert,Error);

module.exports = NoInsert;
