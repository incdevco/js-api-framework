var Expect = require("../expect");
var NotValid = require("../errors").NotValid;

function ExistsValidator(config) {
	"use strict";

	config = config || {};

	Expect(config.key).to.be.a("string");
	Expect(config.service).to.be.an("object");
	Expect(config.service.fetchOne).to.be.a("function");

	this.key = config.key;
	this.message = config.message || "Does Not Exist";
	this.service = config.service;

}

ExistsValidator.prototype.validate = function validate(value) {
	"use strict";

	var message = this.message, where = {};

	where[this.key] = value;

	return this.service.fetchOne(where)
		.then(function () {

			return true;

		}, function () {

			throw new NotValid(message);

		});

};

module.exports = ExistsValidator;
