var Expect = require('../expect');
var NotValid = require('../errors').NotValid;
var Promise = require('../promise');

function RegexValidator(config) {

	config = config || {};

	Expect(config.regex).to.be.instanceof(RegExp);

	this.message = config.message || 'Does Not Match';
	this.regex = config.regex;

}

RegexValidator.prototype.validate = function validate(value,context) {

	var self = this;

	return new Promise(function (resolve,reject) {

		if (self.regex.test(value)) {

			return resolve(true);

		} else {

			return reject(new NotValid(self.message));

		}

	});

};

module.exports = RegexValidator;
