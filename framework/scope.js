var Injector = require('./injector');

function Scope(config) {
	
	config = config || {};
	
	this.cache = config.cache;
	this.roles = config.roles || [];
	this.services = config.services || {};
	this.time = config.time;
	
}

Scope.prototype.service = function (name,service) {
	
	if (service) {
		
		if ('function' === typeof service) {
			
			service = service();
			
		}
		
		this.services[name] = service;
		
		return this;
		
	} else {
		
		return this.services[name];
		
	}
	
};

module.exports = Scope;