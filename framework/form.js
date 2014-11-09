var Exceptions = require('./exceptions');
var Promise = require('./promise');

function Form(config) {
	
	var form = this;
	
	config = config || {};
	
	this.attributes = {};
	
	if (config.attributes) {
		
		Object.keys(config.attributes).forEach(function (key) {
			
			form.attribute(key,config.attributes[key]);
			
		});
		
	}
	
}

Form.prototype.attribute = function attribute(key,attribute) {
	
	if (attribute) {
		
		if ('function' === typeof attribute) {
			
			attribute = attribute();
			
		}
		
		this.attributes[key] = attribute;
		
		return this;
		
	} else {
		
		return this.attributes[key];
		
	}
	
};

Form.prototype.validate = function validate(scope,data) {
	
	var attributes = this.attributes,
		clean = {},
		errors = {},
		promises = [];
	
	Object.keys(attributes).forEach(function (key) {
		
		promises.push(attributes[key].validate(scope,data[key],data).then(function (value) {
			
			clean[key] = value;
			
			return true;
			
		},function (exception) {
			
			console.error(exception,exception.stack);
			
			errors[key] = exception;
			
			throw exception;
			
		}));
		
	});
	
	return Promise.all(promises)
		.then(function () {
			
			return clean;
			
		},function () {
			
			console.log('form invalid',data,errors);
			
			throw new Exceptions.NotValid({
				errors: errors
			});
			
		});
	
};

module.exports = Form;