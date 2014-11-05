var Promise = require('../promise');

function InArrayValidator(config) {
	
	if (Array.isArray(config)) {
		
		this.array = config;
		
	} else {
	
		this.array = config.array;
	
	}
	
}

InArrayValidator.prototype.validate = function (value) {
	var self = this;
	return new Promise(function (resolve,reject) {
		if (self.array.indexOf(value) >= 0) {
			resolve(true);
		} else {
			reject('Value Not Allowed');
		}
	});
};

module.exports = InArrayValidator;