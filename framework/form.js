var Exceptions = require('./exceptions');
var Promise = require('./promise');

function Form(config) {
	
	this.attributes = config.attributes;
	
}

Form.prototype.validate = function (data) {
	
	var attributes = this.attributes, 
		clean = {},
		data = data || {},
		messages = {}, 
		promises = [];
	
	for (var i in attributes) {
		
		(function (i) {
			
			var promise = attributes[i].validate(data[i]);
			
			if (undefined !== data[i]) {
				
				clean[i] = data[i];
			}
			
			promise.catch(function (exception) {
				
				messages[i] = exception;
				
				return exception;
				
			});
			
			promises.push(promise);
			
		})(i);
		
	}
	
	return Promise.all(promises).then(function () {
		
		return clean;
		
	}).catch(function (exception) {
		
		throw new Exceptions.NotValid({
			content: messages
		});
		
	});
	
};

module.exports = Form;