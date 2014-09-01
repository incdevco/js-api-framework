module.exports = function (request,response,scope) {
	
	var controller = this;
	
	console.log('get-all',controller);
	
	return scope.service(this.service).fetchAll(request.params,request.limit,request.offset,scope).then(function (set) {
		
		return set.toJson(scope).then(function (string) {
			
			response.statusCode = 200;
			
			if (controller.cache) {
				
				response.setHeader('Cache-Control','private, max-age='+controller.cache);
				
			}
			
			response.setHeader('X-Actual-Length',set.actualLength);
			
			response.write(string);
			
			return true;
			
		});
		
	});
	
};