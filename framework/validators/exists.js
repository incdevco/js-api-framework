var Expect = require('../expect');
var NotValid = require('../errors').NotValid;
var Promise = require('../promise');

function ExistsValidator(config) {

	config = config || {};

	Expect(config.key).to.be.a('string');
	Expect(config.service).to.be.an('object');
	Expect(config.service.fetchOne).to.be.a('function');

	this.key = config.key;
	this.message = config.message || 'Does Not Exist';
	this.service = config.service;

}

ExistsValidator.prototype.validate = function (value,context) {

	var message = this.message, where = {};

	where[this.key] = value;

	return this.service.fetchOne(where)
		.then(function () {

			return true;

		},function (error) {

			throw new NotValid(message);

		});

};

module.exports = ExistsValidator;
