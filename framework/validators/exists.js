function ExistsValidator(config) {
	
	this.key = config.key;
	this.message = config.message || 'Does Not Exist';
	this.service = config.service;
	
}

ExistsValidator.prototype.validate = function (value,context,scope) {
	
	var data = {}, message = this.message;
	
	data[this.key] = value;
	
	return scope.service(this.service).fetchOne(data,scope,true).then(function () {
		
		return true;
		
	}).catch(function () {
		
		throw message;
		
	});
	
};

module.exports = ExistsValidator;