module.exports = function (request,response,scope) {
	
	return scope.service(this.service).fetchNew().then(function (model) {
		
		return model.save(request.body,scope).then(function (model) {
			
			return model.toJson(scope).then(function (string) {
				
				response.statusCode = 201;
				response.write(string);
				
				return true;
				
			});
			
		});
		
	});
	
};