var Exceptions = require('../exceptions');

module.exports = function getAll(config) {
	
	return function controller(scope,request,response) {
		
		return scope.service(config.service).fetchAll(scope,request.query)
			.then(function found(set) {
				
				response.statusCode = 200;
				response.write(JSON.stringify(set));
				
				return true;
				
			});
		
	};
	
};