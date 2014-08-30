function NotAllowedException(config) {
	
	this.content = 'Not Allowed';
	this.statusCode = 403;
	
	if (config) {
		
		console.log(config);
		
		this.content = 'Not allowed to '+config.privilege+' on '+config.resource+'.';
		
	}
	
}

module.exports = NotAllowedException;