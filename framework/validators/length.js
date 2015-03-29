var NotValid = require('../errors').NotValid;
var Promise = require('../promise');

function LengthValidator(config) {

	config = config || {};

	this.max = config.max;

	this.messages = config.messages || {
		max: 'Too Long',
		min: 'Too Short'
	};

	this.min = config.min;

}

LengthValidator.prototype.validate = function validate(value,context) {

	var self = this;

	return new Promise(function (resolve,reject) {

		if (typeof value == 'number') {

			value = value.toString();

		}

		if (typeof value == 'string' || Array.isArray(value)) {

			if (undefined !== self.max && value.length > self.max) {

				return reject(new NotValid(self.messages.max));

			} else if (undefined !== self.min && value.length < self.min) {

				return reject(new NotValid(self.messages.min));

			} else {

				return resolve(true);

			}

		} else {

			return resolve(true);

		}

	});

};

module.exports = LengthValidator;
