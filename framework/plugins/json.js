var base = process.env.PWD;

var Plugin = require('../plugin');
var Promise = require('../promise');

function Json(config) {
	
	config = config || {};
	
	this.charset = config.charset || 'UTF-8';
	this.contentType = config.contentType || 'application/json';
	
	Plugin.call(this,config);
	
}

Json.prototype = Object.create(Plugin.prototype);
Json.prototype.constructor = Json;

Json.prototype.before = function (request,response,scope) {
	
	response.setHeader('Content-Type',this.contentType+';'+this.charset);
	
	return Promise.resolve(true);
	
};

module.exports = Json;