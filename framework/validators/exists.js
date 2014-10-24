var Promise = require('../promise');

function ExistsValidator(config) {
	
	this.key = config.key;
	this.message = config.message || 'Does Not Exist';
	this.service = config.service;
	
}

ExistsValidator.prototype.validate = function (scope,value,context) {
	
	var data = {}, 
		message = this.message, 
		service = scope.service(this.service);
	
	data[this.key] = value;
	
	if (service) {
		
		return service.fetchOne(data,scope,true).then(function () {
			
			return true;
			
		}).catch(function () {
			
			throw message;
			
		});
		
	}
	
	//console.error('Exists Validator','Service Not Found',this.service,service);
	
	return Promise.reject(message);
	
};

module.exports = ExistsValidator;