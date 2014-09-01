module.exports = function (request,response,scope) {
	
	var controller = this;
	
	return scope.service(this.service).fetchOne(request.params,scope).then(function (model) {
		
		return model.toJson(scope).then(function (string) {
			
			response.statusCode = 200;
			
			if (controller.cache) {
				
				response.setHeader('Cache-Control','private, max-age='+controller.cache);
				
			}
			
			response.write(string);
			
			return true;
			
		});
		
	});
	
};