var util = require('util');

function NotAllowed(resource,privilege) {

  Error.call(this);

  this.message = 'Not Allowed';

  this.resource = resource;

  this.privilege = privilege;

}

util.inherits(NotAllowed,Error);

module.exports = NotAllowed;
