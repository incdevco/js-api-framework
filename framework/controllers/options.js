var Promise = require('../promise');

module.exports = function (request,response,scope) {
	
	response.statusCode = 200;
	
	response.setHeader('Access-Control-Allow-Methods','DELETE,POST,PUT');
	
	return Promise.resolve(true);
	
};