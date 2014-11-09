function NotAllowed(config) {
	
	config = config || {};
	
	this.resource = config.resource;
	this.privilege = config.privilege;
	
	this.name = "NotAllowed";
	Error.captureStackTrace(this, NotAllowed);
	
}

NotAllowed.prototype = Object.create(Error.prototype);
NotAllowed.prototype.constructor = NotAllowed;

module.exports = NotAllowed;