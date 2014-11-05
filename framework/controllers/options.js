var Promise = require('../promise');

module.exports = function options(config) { 

	return function controller(scope,request,response) {
		
		response.statusCode = 200;
		
		response.setHeader('Access-Control-Allow-Methods','DELETE,POST,PUT');
		
		return Promise.resolve(true);
		
	};
	
};