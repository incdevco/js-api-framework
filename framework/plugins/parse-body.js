var rawbody = require('raw-body');

var Promise = require('../promise');

module.exports.beforeRoute = function (request,response,scope) {
	
	console.log('ParseBody.beforeRoute');
	
	return new Promise(function (resolve,reject) {
		
		if (undefined === request.on) {
			
			return resolve(true);
			
		} else {
			
			var exception = {
				statusCode: 400,
				content: 'Not Valid JSON'
			};
			
			rawbody(request,{
				length: request.headers['content-length'],
				encoding: 'utf8'
			},function (error,body) {
				
				if (error) {
					
					console.error(error);
					
					return reject(exception);
					
				} else {
					
					if (body && body.length) {
						
						try {
							
							request.body = JSON.parse(body);
							
						} catch (error) {
							
							console.error(error);
							
							return reject(exception);
							
						}
						
					} else {
						
						request.body = {};
						
					}
					
					return resolve(true);
					
				}
				
			});
			
		}
			
	});
	
};