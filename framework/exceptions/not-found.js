function NotFound() {
	
	this.name = "NotFound";
	Error.captureStackTrace(this, NotFound);
	
}

NotFound.prototype = Object.create(Error.prototype);
NotFound.prototype.constructor = NotFound;

module.exports = NotFound;