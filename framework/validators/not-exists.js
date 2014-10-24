var Promise = require('../promise');

function NotExistsValidator(config) {
	
	this.key = config.key;
	this.message = config.message || 'Already Exists';
	this.service = config.service;
	
}

NotExistsValidator.prototype.validate = function (scope,value,context) {
	
	var data = {},
		message = this.message,
		service = scope.service(this.service);
	
	if (service) {
		
		data[this.key] = value;
		
		return service.fetchOne(data).then(function () {
			
			console.log('not-exists fetchOne resolved');
			
			throw message;
			
		},function () {
			
			console.log('not-exists fetchOne rejected');
			
			return true;
			
		});
		
	}
	
	return Promise.reject('Service Not Found');
	
};

module.exports = NotExistsValidator;