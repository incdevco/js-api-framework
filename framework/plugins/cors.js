var Promise = require('../promise');

function Cors(config) {
	
	this.allowHeaders = config.allowHeaders || [];
	this.exposeHeaders = config.exposeHeaders || [];
	this.origin = config.origin;
	
}

Cors.prototype.beforeRoute = function (request,response,scope) {
	
	//console.log('Cors.beforeRoute');
	
	response.setHeader('Access-Control-Allow-Origin',this.origin);
	response.setHeader('Access-Control-Allow-Headers',this.allowHeaders.join(','));
	response.setHeader('Access-Control-Expose-Headers',this.exposeHeaders.join(','));
	
	return Promise.resolve(true);
	
};

module.exports = Cors;