var util = require("util");

var RegexValidator = require("./regex");

var regex = /^[a-zA-Z]+$/;

function AlphaValidator(config) {
	"use strict";

	config = config || {};

	config.message = config.message || "Only Alpha Characters Allowed";
	config.regex = config.regex || regex;

	RegexValidator.call(this, config);

}

util.inherits(AlphaValidator, RegexValidator);

module.exports = AlphaValidator;
