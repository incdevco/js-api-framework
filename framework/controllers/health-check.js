var Promise = require('../promise');

module.exports = function (request,response,scope) {
	
	response.statusCode = 200;
	
	response.write('Healthy');
	
	return Promise.resolve(true);
	
};