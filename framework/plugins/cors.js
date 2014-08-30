var Plugin = require('../plugin');
var Promise = require('../promise');

function Cors(config) {
	
	this.allowHeaders = config.allowHeaders || [];
	this.exposeHeaders = config.exposeHeaders || [];
	this.origin = config.origin;
	
	Plugin.call(this,config);
	
}

Cors.prototype = Object.create(Plugin.prototype);
Cors.prototype.constructor = Cors;

Cors.prototype.before = function (request,response,scope) {
	
	response.setHeader('Access-Control-Allow-Origin',this.origin);
	response.setHeader('Access-Control-Allow-Headers',this.allowHeaders.join(','));
	response.setHeader('Access-Control-Expose-Headers',this.exposeHeaders.join(','));
	
	return Promise.resolve(true);
	
};

module.exports = Cors;