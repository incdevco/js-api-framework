var Expect = require('../expect');
var NotValid = require('../errors').NotValid;
var Promise = require('../promise');

function InArrayValidator(config) {

	config = config || {};

	Expect(config.values).to.be.instanceof(Array);

	this.message = config.message || 'Value Not Allowed';
	this.values = config.values;

}

InArrayValidator.prototype.validate = function validate(value,context) {

	var self = this;

	return new Promise(function (resolve,reject) {

		if (self.values.indexOf(value) >= 0) {

			return resolve(true);

		} else {

			return reject(new NotValid(self.message));

		}

	});

};

module.exports = InArrayValidator;
