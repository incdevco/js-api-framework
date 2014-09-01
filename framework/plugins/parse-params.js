var Promise = require('../promise');

module.exports.afterRoute = function (request,response,scope) {
	
	console.log('ParseParams.afterRoute');
	
	if ('params' in request) {
			
		if ('limit' in request.params) {
			
			request.limit = request.params.limit;
			
			delete request.params.limit;
			
		}
		
		if ('offset' in request.params) {
			
			request.offset = request.params.offset;
			
			delete request.params.offset;
			
		}
		
	}
	
	return Promise.resolve(true);
	
};