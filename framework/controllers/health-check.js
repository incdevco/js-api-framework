var Controller = require('../controller');
var Promise = require('../promise');

function HealthCheckController(config) {
	
	config = config || {};
	
	Controller.call(this,config);
	
}

HealthCheckController.prototype = Object.create(Controller.prototype);
HealthCheckController.prototype.constructor = HealthCheckController;

HealthCheckController.prototype.handle = function (request,response,scope) {
	
	response.statusCode = 200;
	
	response.write('Healthy');
	
	return Promise.resolve(true);
	
};

module.exports = HealthCheckController;