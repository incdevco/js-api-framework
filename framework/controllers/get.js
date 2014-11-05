var Exceptions = require('../exceptions');

module.exports = function get(config) {
	
	return function controller(scope,request,response) {
		
		return scope.service(config.service).fetchOne(scope,request.query)
			.then(function found(model) {
				
				response.statusCode = 200;
				response.write(JSON.stringify(model));
				
				return true;
				
			});
		
	};
	
};