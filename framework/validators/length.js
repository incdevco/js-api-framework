
var Promise = require('../promise');

function LengthValidator(config) {
	this.max = config.max;
	this.min = config.min;
}

LengthValidator.prototype.validate = function (value) {
	var self = this;
	return new Promise(function (resolve,reject) {
		if (typeof value == 'number') {
			//console.log('length object',value);
			value = value.toString();
		}
		if (typeof value == 'string') {
			if (undefined !== self.max && value.length > self.max) {
				reject('Too Long ('+self.max+' Characters)');
			} else if (undefined !== self.min && value.length < self.min) {
				reject('Too Short ('+self.min+' Characters)');
			} else {
				resolve(true);
			}
		} else if (undefined !== self.min) {
			//console.log('length not string',value);
			reject('Too Short ('+self.min+' Characters)');
		} else {
			resolve(true);
		}
	});
};

module.exports = LengthValidator;