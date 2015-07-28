var util = require("util");

function LeaveMessageInQueue() {
  "use strict";

  Error.call(this);

}

util.inherits(LeaveMessageInQueue, Error);

module.exports = LeaveMessageInQueue;
