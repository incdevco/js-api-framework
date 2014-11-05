var Promise = require('../promise');

function LimitOffset(config) {};

LimitOffset.prototype.afterRoute = function afterRoute(scope,request,response) {
	
	if ('query' in request) {
			
		if ('limit' in request.query) {
			
			request.limit = request.query.limit;
			
			delete request.query.limit;
			
		}
		
		if ('offset' in request.query) {
			
			request.offset = request.query.offset;
			
			delete request.query.offset;
			
		}
		
	}
	
	return Promise.resolve(true);
	
};

module.exports = LimitOffset;