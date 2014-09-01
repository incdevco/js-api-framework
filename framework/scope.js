function Scope(config) {
	
	config = config || {};
	
	this.cache = config.cache;
	this.db = config.db;
	this.injector = config.injector;
	this.roles = config.roles || [];
	this.time = config.time;
	
}

Scope.prototype.service = function (name) {
	
	return this.injector.service(name);
	
};

module.exports = Scope;