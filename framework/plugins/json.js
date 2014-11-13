var Promise = require('../promise');

function Json(config) {};

Json.prototype.beforeRoute = function beforeRoute(scope,request,response) {
	
	response.setHeader('Content-Type','application/json;charset=UTF-8');
	
	return Promise.resolve(true);
	
};

module.exports = Json;