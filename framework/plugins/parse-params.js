var Plugin = require('../plugin');
var Promise = require('../promise');

function ParseParams(config) {
	
	Plugin.call(this,config);
	
}

ParseParams.prototype = Object.create(Plugin.prototype);
ParseParams.prototype.constructor = ParseParams;

ParseParams.prototype.afterRoute = function (request,response,scope) {
	
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

module.exports = ParseParams;