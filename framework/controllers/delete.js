module.exports = function (scope,request,response) {
	
	return scope.service('Service').delete(scope,request.params).then(function (model) {
		
		return scope.service('Service').toJson(scope,model).then(function (json) {
			
			response.statusCode = 200;
			
			response.write(json);
			
			return true;
			
		});
		
	});
	
};