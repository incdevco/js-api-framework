var Resource = require('./resource');

function Module(config) {
	
	var module = this;
	
	config = config || {};
	
	this.resources = {};
	
	if (config.resources) {
		
		Object.keys(config.resources).forEach(function (name) {
			
			module.resource(name,config.resources[name]);
			
		});
		
	}
	
}

Module.prototype.bootstrap = function (application) {
	
	var module = this;
	
	Object.keys(module.resources).forEach(function (name) {
		
		module.resources[name].bootstrap(application);
		
	});
	
	return true;
	
};

Module.prototype.resource = function (name,resource) {
	
	if (resource) {
		
		this.resources[name] = resource;
		
		return this;
		
	} else {
		
		return this.resources[name];
		
	}
	
};

module.exports = Module;