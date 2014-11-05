var Exceptions = require('../exceptions');

module.exports = function (config) {
	
	return function controller(scope,request,response) {
		
		return scope.service(config.service).delete(scope,request.query)
			.then(function deleted(model) {
					
				response.statusCode = 200;
				response.write(JSON.stringify(model));
				
				return true;
				
			});
		
	};
	
};