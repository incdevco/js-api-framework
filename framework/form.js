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

Form.prototype.attribute = function (key,attribute) {
	
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

Form.prototype.validate = function (scope,data) {
	
	var attributes = this.attributes,
		clean = {},
		errors = {},
		promises = [];
	
	Object.keys(attributes).forEach(function (key) {
		
		promises.push(attributes[key].validate(scope,data[key],data).then(function () {
			
			clean[key] = data[key];
			
			return true;
			
		}).catch(function (exception) {
			
			errors[key] = [];
			
			errors[key].push(exception);
			
			throw exception;
			
		}));
		
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