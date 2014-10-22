var Promise = require('../promise');

module.exports = function (scope,request,response) {
	
	response.statusCode = 200;
	
	response.write('Healthy');
	
	return Promise.resolve(true);
	
};