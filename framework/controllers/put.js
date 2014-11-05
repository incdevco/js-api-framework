var Exceptions = require('../exceptions');

module.exports = function put(config) { 

	return function controller(scope,request,response) {
		
		return scope.service(config.service).edit(scope,request.query)
			.then(function edited(model) {
				
				response.statusCode = 200;
				response.write(JSON.stringify(model));
				
				return true;
				
			});
		
	};
	
};