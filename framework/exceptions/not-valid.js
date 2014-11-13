function NotValid(config) {
	
	config = config || {};
	
	this.errors = config.errors;
	this.name = "NotValid";
	Error.captureStackTrace(this, NotValid);
	
}

NotValid.prototype = Object.create(Error.prototype);
NotValid.prototype.constructor = NotValid;

module.exports = NotValid;