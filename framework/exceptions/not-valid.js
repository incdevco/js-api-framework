function NotValidException(config) {
	
	this.statusCode = config.statusCode || 400;
	this.content = 'Not Valid';
	
	if (config.content) {
		
		this.content = JSON.stringify(config.content);
		
	}
	
}

module.exports = NotValidException;