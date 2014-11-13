var Exceptions = require('../exceptions');

module.exports = function get(config) {
	
	return function controller(scope,request,response) {
		
		var service = scope.service(config.service);
		
		return service.fetchOne(scope,request.query)
			.then(function found(model) {
				
				return service.fill(scope,model);
				
			})
			.then(function toJson(model) {
				
				response.statusCode = 200;
				response.write(JSON.stringify(model));
				
				return true;
				
			});
		
	};
	
};