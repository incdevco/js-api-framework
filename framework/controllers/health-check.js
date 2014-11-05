var Promise = require('../promise');

module.exports = function healthCheck(config) {
	
	return function controller(scope,request,response) {
		
		response.statusCode = 200;
		response.write('Healthy');
		
		return Promise.resolve(true);
		
	};
	
};