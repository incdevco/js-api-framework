function Exception(config) {
	
	config = config || {}
	
	this.statusCode = config.statusCode || 500;
	this.content = config.content || 'Exception Occurred';
	
}

module.exports = Exception;