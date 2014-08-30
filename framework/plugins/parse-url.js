var qs = require('qs');
var url = require('url');

var Plugin = require('../plugin');
var Promise = require('../promise');

function ParseUrl(config) {
	
	Plugin.call(this,config);
	
}

ParseUrl.prototype = Object.create(Plugin.prototype);
ParseUrl.prototype.constructor = ParseUrl;

ParseUrl.prototype.before = function (request,response,scope) {
	
	request.url = url.parse(request.url);
	
	request.query = qs.parse(request.url.query);
	
	for (var i in request.query) {
	
		if ('null' === request.query[i]) {
		
			request.query[i] = null;
			
		} else if ('false' === request.query[i]) {
		
			request.query[i] = false;
			
		} else if ('true' === request.query[i]) {
		
			request.query[i] = true;
			
		}
		
	}
	
	return Promise.resolve(true);
	
};

module.exports = ParseUrl;