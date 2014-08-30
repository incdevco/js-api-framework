var base = process.env.PWD;

var bunyan = require('bunyan');
var moment = require('moment');
var objectMerge = require('object-merge');

var Cache = require('./cache');
var NotFound = require('./exceptions/not-found');
var ParseUrl = require('./plugins/parse-url');
var Promise = require('./promise');
var Route = require('./route');
var Scope = require('./scope');

function Application (config) {
	
	this.controllers = {};
	this.items = {};
	this.log = config.log || bunyan.createLogger({
		name: 'app',
		level: 'trace'
	});
	this.plugins = [ParseUrl];
	this.routes = [];
	this.services = {};
	
}

Application.prototype.after = function (request,response,scope) {
	
	return this.runPlugins('after',request,response,scope);
	
};

Application.prototype.afterRoute = function (request,response,scope) {
	
	return this.runPlugins('afterRoute',request,response,scope);
	
};

Application.prototype.before = function (request,response,scope) {
	
	return this.runPlugins('before',request,response,scope);
	
};

Application.prototype.controller = function (name,controller) {
	
	if (controller) {
		
		controller.application = this;
		
		this.controllers[name] = controller;
		
		return this;
		
	} else {
		
		return this.controllers[name];
		
	}
	
};

Application.prototype.handle = function (request,response) {
	
	var app, log, scope;
	
	console.log('New Request',request.method,request.url);
	
	app = this;
	
	scope = new Scope();
	scope.time = moment();
	scope.cache = new Cache();
	
	var result = app.before(request,response,scope);
	
	result.then(function () {
		
		var route = app.match(request);
		
		if (route) {
			
			scope.route = route;
			
			request.params = objectMerge(request.query,route.params);
			
			return app.afterRoute(request,response,scope).then(function () {
				
				var controller = app.controller(route.controller);
				
				if (undefined !== controller) {
					
					return controller.handle(request,response,scope).then(function () {
						
						return app.after(request,response,scope).then(function () {
							
							response.statusCode = response.statusCode || 200;
							
							response.end();
							
							return true;
							
						})
						
					});
					
				} else {
					
					console.error('No Controller Found',route.controller,app.controllers);
					
					throw new NotFound();
					
				}
				
			});
			
		} else {
			
			console.error('No Route Found');
			
			throw new NotFound();
			
		}
		
	}).catch(function (exception) {
		
		console.error('exception',exception,exception.stack);
		
		response.statusCode = exception.statusCode || 500;
		response.write(exception.content || JSON.stringify(exception) || 'Exception Occurred');
		response.end();
		
	});
	
};

Application.prototype.match = function (request) {
	
	var promises = [];
	
	if (request.method in this.routes) {
		
		for (var i = 0, length = this.routes[request.method].length; i < length; i++) {
			
			var result = this.routes[request.method][i].match(request.url);
			
			if (result) {
				
				return result;
				
			}
			
		}
		
		return false;
		
	} else {
		
		//this.log.info('Method Not Implemented: '+request.method);
		
		return false;
		
	}
};

Application.prototype.plugin = function (plugin) {
	
	if ('function' === typeof(plugin.bootstrap)) {
		
		plugin.bootstrap(this);
		
	}
	
	this.plugins.push(plugin);
	
	return this;

};

Application.prototype.resource = function (resource) {
	
	resource.bootstrap(this);

};

Application.prototype.runPlugins = function (fn,request,response,scope) {
	
	var app = this, result = Promise.resolve();
	
	for (var i = 0, length = app.plugins.length; i < length; i++) {
		
		(function (i) {
			
			if ('function' === typeof app.plugins[i][fn]) {
				
				result = result.then(function () {
					
					//console.log(fn,app.plugins[i][fn]);
					
					return app.plugins[i][fn](request,response,scope);
					
				});
				
			}
			
		})(i);
		
	}
	
	return result;
	
};

Application.prototype.service = function (name,service) {
	
	if (service) {
		
		this.services[name] = service;
		
		service.application = this;
		
		return this;
		
	} else {
		
		return this.services[name];
		
	}
	
};

Application.prototype.when = function (method,path,controller) {
	
	var route = new Route(path,controller);
	
	if (undefined === this.routes[method]) {
	
		this.routes[method] = [];
	
	}
	
	this.routes[method].push(route);
	
	return this;
	
};

module.exports = Application;