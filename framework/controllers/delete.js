module.exports = function (scope,request,response) {
	
	var service = this.service;
	
	return service.delete(scope,request.params).then(function (model) {
		
		return service.toJson(scope,model).then(function (json) {
			
			response.statusCode = 200;
			
			response.write(json);
			
			return true;
			
		});
		
	});
	
};