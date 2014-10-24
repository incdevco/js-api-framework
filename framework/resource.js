var Controllers = require('./controllers');
var Attribute = require('./attribute');
var Form = require('./form');
var Service = require('./service');

function Resource(config) {
	
	var resource = this;
	
	config = config || {};
	
	this.attributes = {};
	
	this.controllers = {};
	
	this.id = config.id;
	
	this.forms = {};
	
	this.routes = {};
	
	this._service = null;
	
	if (config.attributes) {
	
		Object.keys(config.attributes).forEach(function (name) {
			
			resource.attribute(name,config.attributes[name]);
			
		});
		
	}
	
	if (config.controllers) {
		
		Object.keys(config.controllers).forEach(function (method) {
			
			resource.controller(method,config.controllers[method]);
			
		});
		
	}
	
	if (config.forms) {
		
		Object.keys(config.forms).forEach(function (name) {
			
			resource.form(name,config.forms[name]);
			
		});
		
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

Resource.prototype.attribute = function (name,attribute) {
	
	if (attribute) {
		
		this.attributes[name] = attribute;
		
		return this;
		
	} else {
	
		return this.attributes[name];
	
	}
	
};

Resource.prototype.bootstrap = function (application) {
	
	var resource = this;
	
	Object.keys(this.routes).forEach(function (path) {
		
		var controllers = {};
		
		resource.routes[path].forEach(function (method) {
				
			controllers[method] = resource.controller(method);
			
		});
		
		application.when(path,controllers,resource);
		
	});
	
};

Resource.prototype.controller = function (method,controller) {
	
	if (controller) {
		
		this.controllers[method] = controller;
		
		return this;
		
	} else {
	
		return this.controllers[method];
	
	}
	
};

Resource.prototype.form = function (name,form) {
	
	if (form) {
		
		this.forms[name] = form;
		
		return this;
		
	} else {
	
		return this.forms[name];
	
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