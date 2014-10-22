var Exceptions = require('./exceptions');
var Promise = require('./promise');

function Form(config) {
	
	config = config || {};
	
	this.attributes = config.attributes || {};
	
}

Form.prototype.validate = function (scope,data) {
	
	var attributes = this.attributes,
		attributesKeys = Object.keys(attributes),
		clean = {},
		dataKeys = Object.keys(data),
		errors = {},
		promises = [];
	
	dataKeys.forEach(function (dataKey) {
		
		attributesKeys.forEach(function (attributeKey) {
			
			if (dataKey.match(attributeKey)) {
				
				promises.push(attributes[attributeKey].validate(scope,data[dataKey],data).then(function () {
					
					clean[dataKey] = data[dataKey];
					
					return true;
					
				}).catch(function (exception) {
					
					//console.error(exception,exception.stack);
					
					if (undefined === errors[dataKey]) {
						
						errors[dataKey] = [];
						
					}
					
					errors[dataKey].push(exception);
					
					throw exception;
					
				}));
				
			}
			
		});
		
	});
	
	return Promise.all(promises).then(function () {
		
		return clean;
		
	}).catch(function () {
		
		throw new Exceptions.NotValid({
			content: errors
		});
		
	});
	
};

module.exports = Form;