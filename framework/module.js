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

Module.prototype._bootstrap = function (application) {
	
	var module = this;
	
	Object.keys(module.resources).forEach(function (name) {
		
		console.log('resource',name);
		
		module.resources[name]._bootstrap(application);
		
		if ('function' === typeof module.resources[name].bootstrap) {
			
			module.resources[name].bootstrap(application);
			
		}
		
	});
	
	return true;
	
};

Module.prototype.resource = function (name,resource) {
	
	if (resource) {
		
		if ('function' === typeof resource) {
			
			resource = resource();
			
		}
		
		this.resources[name] = resource;
		
		return this;
		
	} else {
		
		return this.resources[name];
		
	}
	
};

module.exports = Module;