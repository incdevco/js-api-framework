var Promise = require('../promise');

module.exports = function (request,response,scope) {
	
	response.statusCode = 200;
	
	response.setHeader('Access-Control-Allow-Methods',this.methods.join(','));
	
	if (this.cache) {
		
		response.setHeader('Cache-Control','private, max-age='+this.cache);
		
	}
	
	return Promise.resolve(true);
	
};