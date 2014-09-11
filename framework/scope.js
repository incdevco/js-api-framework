var Injector = require('./injector');

function Scope(config) {
	
	config = config || {};
	
	this.cache = config.cache;
	this.closers = [];
	this.db = config.db;
	this.injector = config.injector || new Injector();
	this.roles = config.roles || [];
	this.time = config.time;
	
}

Scope.prototype.close = function () {
	
	for (var i = 0, length = this.closers; i < length; i++) {
		
		this.closers[i](this);
		
	}
	
};

Scope.prototype.service = function (name,service) {
	
	return this.injector.service(name,service);
	
};

module.exports = Scope;