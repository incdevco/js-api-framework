module.exports = function (scope,request,response) {
	
	var service = this.service;
	
	return service.update(scope,request.body).then(function (model) {
		
		return service.toJson(scope,model).then(function (json) {
			
			response.statusCode = 200;
			
			response.write(json);
			
			return true;
			
		});
		
	});
	
};