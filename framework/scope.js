var Injector = require('./injector');

function Scope(config) {
	
	config = config || {};
	
	this.cache = config.cache;
	this.db = config.db;
	this.injector = config.injector || new Injector();
	this.roles = config.roles || [];
	this.time = config.time;
	
}

Scope.prototype.module = function (name,module) {
	
	return this.injector.module(name,module);
	
};

Scope.prototype.service = function (name,service) {
	
	return this.injector.service(name,service);
	
};

module.exports = Scope;