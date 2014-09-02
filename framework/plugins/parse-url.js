var qs = require('qs');
var url = require('url');

var Promise = require('../promise');

module.exports.beforeRoute = function (request,response,scope) {
	
	//console.log('ParseUrl.beforeRoute');
	
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