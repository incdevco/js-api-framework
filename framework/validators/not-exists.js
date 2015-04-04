var Expect = require('../expect');
var NotValid = require('../errors').NotValid;
var Promise = require('../promise');

function NotExistsValidator(config) {

	config = config || {};

	Expect(config.key).to.be.a('string');
	Expect(config.service).to.be.an('object');
	Expect(config.service.fetchOne).to.be.a('function');

	this.key = config.key;
	this.message = config.message || 'Already Exists';
	this.service = config.service;

}

NotExistsValidator.prototype.validate = function (value,context) {

	var message = this.message, where = {};

	where[this.key] = value;

	return this.service.fetchOne(where)
		.then(function () {

			throw new NotValid(message);

		},function () {

			return true;

		});

};

module.exports = NotExistsValidator;
