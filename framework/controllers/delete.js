module.exports = function (request,response,scope) {
	
	return scope.service(this.service).fetchOne(request.params,scope).then(function (model) {
		
		return model.delete(scope).then(function (model) {
			
			return model.toJson(scope).then(function (string) {
				
				response.statusCode = 200;
				response.write(string);
				
				return true;
				
			});
			
		});
		
	});
	
};