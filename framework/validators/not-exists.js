function NotExistsValidator(config) {
	
	this.key = config.key;
	this.message = config.message || 'Already Exists';
	this.service = config.service;
	
}

NotExistsValidator.prototype.validate = function (value) {
	
	var data = {},message = this.message;
	
	data[this.key] = value;
	
	return this.service.fetchOne(data).then(function () {
		
		throw message;
		
	}).catch(function () {
		
		return true;
		
	});
	
};

module.exports = NotExistsValidator;