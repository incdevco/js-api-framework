var base = process.env.PWD;

var Framework = require(base+'/framework');

module.exports = function (config) {
	
	var attribute;
	
	attribute = new Framework.Attributes.Content(config);
	
	return attribute;
	
};