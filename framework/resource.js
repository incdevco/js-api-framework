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
		
		var controllers = {}, methods = resource.routes[path];
		
		if (!Array.isArray(resource.routes[path])) {
			
			methods = Object.keys(methods);
			
		}
		
		methods.forEach(function (method) {
			
			var controller;
			
			if (Array.isArray(resource.routes[path])) {
				
				controller = resource.controllers[method];
				
			} else {
				
				controller = resource.routes[path][method];
				
			}
			
			if ('string' === typeof controller) {
				
				controller = resource.controllers[controller];
				
			}
			
			if (controller.length != 3) {
				
				//console.log(controller,resource);
				
				controller = controller({
					primary: resource.primary,
					service: resource.id
				});
				
			}
			
			if ('GETALL' === method) {
				
				method = 'GET';
				
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