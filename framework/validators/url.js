var validator = require('validator');

var Promise = require('../promise');

function Url(config) {
	
	
	
}

Url.prototype.validate = function (scope,value,context) {
	
	if (validator.isURL(value)) {
		
		return Promise.resolve(true);
		
	} else {
		
		return Promise.reject('Not A Valid Url');
		
	}
	
};

module.exports = Url;