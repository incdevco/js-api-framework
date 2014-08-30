var rawbody = require('raw-body');

var Plugin = require('../plugin');
var Promise = require('../promise');

function ParseBody(config) {
	
	Plugin.call(this,config);
	
}

ParseBody.prototype = Object.create(Plugin.prototype);
ParseBody.prototype.constructor = ParseBody;

ParseBody.prototype.before = function (request,response,scope) {
	
	return new Promise(function (resolve,reject) {
		
		var exception = {
			statusCode: 400,
			content: 'Not Valid JSON'
		};
		
		rawbody(request,{
			length: request.headers['content-length'],
			encoding: 'utf8'
		},function (error,body) {
			
			if (error) {
				
				return reject(exception);
				
			} else {
				
				if (body && body.length) {
					
					try {
						
						request.body = JSON.parse(body);
						
					} catch (error) {
						
						return reject(exception);
						
					}
					
				} else {
					
					request.body = {};
					
				}
				
				return resolve(true);
				
			}
			
		});
			
	});
	
};

module.exports = ParseBody;