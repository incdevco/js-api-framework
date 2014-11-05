function Exception() {
	
	this.name = "Exception";
	Error.captureStackTrace(this, Exception);
	
}

Exception.prototype = Object.create(Error.prototype);
Exception.prototype.constructor = Exception;

module.exports = Exception;