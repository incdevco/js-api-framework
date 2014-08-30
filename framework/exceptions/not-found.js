function NotFoundException() {
	
	this.statusCode = 404;
	this.content = 'Not Found';
	
}

module.exports = NotFoundException;