module.exports = function (scope,request,response) {
	
	var service = scope.service('Service');
	
	return service.fetchAll(scope,request.query,request.limit,request.offset).then(function (set) {
		
		return service.toJson(scope,set).then(function (json) {
			
			response.statusCode = 200;
			
			response.write(json);
			
			return true;
			
		});
		
	});
	
};