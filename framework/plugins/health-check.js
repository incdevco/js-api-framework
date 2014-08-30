var Controller = require('../controllers/health-check');
var Plugin = require('../plugin');
var Promise = require('../promise');

function HealthCheck(config) {
	
	Plugin.call(this,config);
	
}

HealthCheck.prototype = Object.create(Plugin.prototype);
HealthCheck.prototype.constructor = HealthCheck;

HealthCheck.prototype.before = function (request,response,scope) {
	
	return Promise.resolve(true);
	
};

HealthCheck.prototype.bootstrap = function (application) {
	
	application.controller('HealthCheckController',new Controller());
	
	application.when('GET','/health-check','HealthCheckController');
	
	return Plugin.prototype.bootstrap.call(this,application);
	
};

module.exports = HealthCheck;