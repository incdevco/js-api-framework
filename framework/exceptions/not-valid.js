function NotValidException(config) {
	
	this.statusCode = config.statusCode || 400;
	this.content = config.content || 'Not Valid';
	
}

module.exports = NotValidException;