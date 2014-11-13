var Promise = require('../promise');

module.exports = function options(config) { 
	
	var methods;
	
	config = config || {};
	
	methods = config.methods || ['DELETE','GET','POST','PUT'];
	
	return function controller(scope,request,response) {
		
		response.statusCode = 200;
		
		response.setHeader('Access-Control-Allow-Methods',methods.join(','));
		
		return Promise.resolve(true);
		
	};
	
};