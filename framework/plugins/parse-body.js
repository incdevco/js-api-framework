var rawbody = require('raw-body');
var qs = require('qs');

var Promise = require('../promise');

module.exports.beforeRoute = function (request,response,scope) {
	
	//console.log('ParseBody.beforeRoute');
	
	return new Promise(function (resolve,reject) {
		
		if (undefined === request.on) {
			
			return resolve(true);
			
		} else {
			
			rawbody(request,{
				length: request.headers['content-length'],
				encoding: 'utf8'
			},function (error,body) {
				
				if (error) {
					
					console.error(error);
					
					return reject({
						statusCode: 400,
						content: 'Invalid Body'
					});
					
				} else {
					
					if (body && body.length) {
						
						if (request.headers['content-type'].match('json')) {
							
							try {
								
								request.body = JSON.parse(body);
								
							} catch (error) {
								
								console.error(error);
								
								return reject({
									statusCode: 400,
									content: 'Not Valid JSON'
								});
								
							}
							
						} else {
							
							try {
								
								request.body = qs.parse(body);
								
							} catch (error) {
								
								console.error(error);
								
								return reject({
									statusCode: 400,
									content: 'Invalid Body'
								});
								
							}
							
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