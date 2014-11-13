var Exceptions = require('../exceptions');

module.exports = function getAll(config) {
	
	return function controller(scope,request,response) {
		
		var service = scope.service(config.service);
		
		return service.fetchAll(scope,request.query)
			.then(function found(set) {
				
				return service.fillSet(scope,set);
				
			})
			.then(function toJson(set) {
				
				response.statusCode = 200;
				response.write(JSON.stringify(set));
				
				return true;
				
			});
		
	};
	
};