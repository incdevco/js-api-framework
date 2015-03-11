var Promise = require('../promise');

function Cors(config) {
	
	config = config || {};
	
	this.allowHeaders = config.allowHeaders || [];
	this.exposeHeaders = config.exposeHeaders || [];
	this.origin = config.origin;
	
}

Cors.prototype.beforeRoute = function (scope,request,response) {
	
	//console.log('Cors.beforeRoute');
	
	if (Array.isArray(this.origin)) {
		
		if (this.origin.indexOf(request.headers.origin) > -1) {
			
			response.setHeader('Access-Control-Allow-Origin',request.headers.origin);
			
		}
		
	} else {
		
		response.setHeader('Access-Control-Allow-Origin',this.origin);
		
	}
	
	response.setHeader('Access-Control-Allow-Headers',this.allowHeaders.join(','));
	response.setHeader('Access-Control-Expose-Headers',this.exposeHeaders.join(','));
	
	return Promise.resolve(true);
	
};

module.exports = Cors;