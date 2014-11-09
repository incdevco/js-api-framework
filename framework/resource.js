var Controllers = require('./controllers');
var Attribute = require('./attribute');
var Form = require('./form');
var Service = require('./service');

function Resource(config) {
	
	var resource = this;
	
	config = config || {};
	
	this.controllers = Controllers;
	this.id = config.id;
	this.primary = [];
	this.routes = {};
	
	this._service = null;
	
	if (config.controllers) {
		
		Object.keys(config.controllers).forEach(function (method) {
			
			resource.controller(method,config.controllers[method]);
			
		});
		
	}
	
	if (config.primary) {
		
		if (!Array.isArray(config.primary)) {
			
			config.primary = [config.primary];
			
		}
		
		this.primary = config.primary;
		
	}
	
	if (config.routes) {
		
		Object.keys(config.routes).forEach(function (path) {
			
			resource.route(path,config.routes[path]);
			
		});
		
	}
	
	if (config.service) {
		
		resource.service(config.service);
		
	}
	
}

Resource.prototype._bootstrap = function (application) {
	
	var resource = this;
	
	//console.log('routes',this.routes);
	
	Object.keys(this.routes).forEach(function (path) {
		
		//console.log('route',path);
		
		var controllers = {};
		
		Object.keys(resource.routes[path]).forEach(function (method) {
			
			var controller = resource.routes[path][method];
			
			if ('function' !== typeof controller) {
				
				throw new Error('controller must be a function');
				
			}
			
			if (controller.length != 3) {
				
				controller = controller({
					primary: resource.primary,
					service: resource.id
				});
				
			}
			
			controllers[method] = controller;
			
		});
		
		application.when(path,controllers);
		
	});
	
	application.service(this.id,this._service);
	
};

Resource.prototype.controller = function (method,controller) {
	
	if (controller) {
			
		this.controllers[method] = controller;
		
		return this;
		
	} else {
	
		return this.controllers[method];
	
	}
	
};

Resource.prototype.route = function (path,methods) {
	
	if (methods) {
		
		this.routes[path] = methods;
		
		return this;
		
	} else {
	
		return this.routes[path];
	
	}
	
};

Resource.prototype.service = function (service) {
	
	if (service) {
		
		this._service = service;
		
		return this;
		
	} else {
	
		return this._service;
	
	}
	
};

module.exports = Resource;