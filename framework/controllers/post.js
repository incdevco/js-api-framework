var Exceptions = require('../exceptions');

module.exports = function post(config) {

	return function controller(scope,request,response) {
		
		return scope.service(config.service).add(scope,request.body)
			.then(function added(model) {
				
				response.statusCode = 201;
				response.write(JSON.stringify(model));
				
				return true;
				
			});
		
	};
	
};