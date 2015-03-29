var util = require('util');

var RegexValidator = require('./regex');

var regex = /^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/;

function FloatValidator(config) {

	config = config || {};

	config.regex = config.regex || regex;
	config.message = config.message || 'Must Be A Float';

	RegexValidator.call(this,config);

}

util.inherits(FloatValidator,RegexValidator);

module.exports = FloatValidator;
