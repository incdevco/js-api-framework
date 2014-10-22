var Promise = require('../promise');

module.exports.beforeRoute = function (scope,request,response) {
	
	//console.log('Json.beforeRoute');
	
	response.setHeader('Content-Type','application/json;charset=UTF-8');
	
	return Promise.resolve(true);
	
};