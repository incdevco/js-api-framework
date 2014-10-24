module.exports = function (scope,request,response) {
	
	var promise, service = this.service;
	
	console.log(request.query);
	
	if (request.query[this.id]) {
		
		promise = service.fetchOne(scope,request.params);
		
	} else {
		
		promise = service.fetchAll(scope,request.params,request.limit,request.offset);
		
	}
	
	return promise.then(function (model) {
		
		return service.toJson(scope,model).then(function (json) {
			
			response.statusCode = 200;
			
			response.write(json);
			
			return true;
			
		});
		
	});
	
};