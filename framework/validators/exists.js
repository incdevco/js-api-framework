function ExistsValidator(config) {
	
	this.key = config.key;
	this.message = config.message || 'Does Not Exist';
	this.service = config.service;
	
}

ExistsValidator.prototype.validate = function (value) {
	
	var data = {},message = this.message;
	
	data[this.key] = value;
	
	return this.service.fetchOne(data).then(function () {
		
		return true;
		
	}).catch(function () {
		
		throw message;
		
	});
	
};

module.exports = ExistsValidator;