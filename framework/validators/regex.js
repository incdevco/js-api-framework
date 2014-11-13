var Promise = require('../promise');

function RegexValidator(config) {
	
	config = config || {};
	
	this.message = config.message || 'Does Not Match';
	this.regex = config.regex;
	
}

RegexValidator.prototype.validate = function (scope,value,context) {
	var self = this;
	return new Promise(function (resolve,reject) {
		if (self.regex.test(value)) {
			resolve(true);
		} else {
			//console.error(value);
			reject(self.message+' ('+value+')');
		}
	});
};

module.exports = RegexValidator;