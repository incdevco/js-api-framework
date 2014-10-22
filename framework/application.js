var objectMerge = require('object-merge');

var Cache = require('./cache');
var Injector = require('./injector');
var Moment = require('./moment');
var NotFound = require('./exceptions/not-found');
var Promise = require('./promise');
var Route = require('./route');
var Scope = require('./scope');

function Application (config) {
	
	config = config || {};
	
	this.injector = config.injector || new Injector();
	this.log = config.log;
	this.modules = {};
	this.plugins = [];
	this.routes = [];
	
}

Application.prototype.afterController = function (scope,request,response) {
	
	return this.runPlugins('afterController',scope,request,response);
	
};

Application.prototype.afterRoute = function (scope,request,response) {
	
	return this.runPlugins('afterRoute',scope,request,response);
	
};

Application.prototype.beforeController = function (scope,request,response) {
	
	return this.runPlugins('beforeController',scope,request,response);
	
};

Application.prototype.beforeRoute = function (scope,request,response) {
	
	return this.runPlugins('beforeRoute',scope,request,response);
	
};

Application.prototype.bootstrap = function () {
	
	var application = this, modules = Object.keys(this.modules);
	
	modules.forEach(function (module) {
		
		application.modules[module](application);
		
	});
	
};

Application.prototype.handle = function (request,response) {
	
	var application = this, 
		scope = new Scope({
			cache: new Cache(),
			injector: new Injector(this.injector),
			time: Moment()
		});
	
	application.beforeRoute(scope,request,response).then(function () {
		
		//console.log('beforeRoute',request.method,request.url);
		
		scope.route = application.match(request);
		
		if (scope.route) {
			
			request.params = objectMerge(request.query,scope.route.params);
			
			return application.afterRoute(scope,request,response).then(function () {
				
				//console.log('afterRoute',request.method,request.url);
				
				return application.beforeController(scope,request,response).then(function () {
					
					//console.log('beforeController',request.method,request.url);
					
					return scope.route.controller(scope,request,response).then(function () {
						
						//console.log('controller',request.method,request.url);
						
						return application.afterController(scope,request,response).then(function () {
							
							//console.log('afterController',request.method,request.url);
							
							response.statusCode = response.statusCode || 200;
							
							response.end();
							
							return true;
							
						})
						
					});
					
				});
				
			});
			
		} else {
			
			//console.error('No Route Found');
			
			throw new NotFound();
			
		}
		
	}).catch(function (exception) {
		
		//console.error('Exception Occurred',request.method,request.url.path,exception,exception.stack);
		
		response.statusCode = exception.statusCode;
		response.write(exception.content);
		response.end();
		
	});
	
};

Application.prototype.match = function (request) {
	
	if (undefined !== this.routes[request.method]) {
		
		//console.log('Application.match',request.method,request.url);
		
		for (var i = 0, length = this.routes[request.method].length; i < length; i++) {
			
			//console.log('Application.match trying route',this.routes[request.method][i]);
			
			var result = this.routes[request.method][i].match(request.url);
			
			if (result) {
				
				return result;
				
			}
			
		}
		
	}
	
	return false;
	
};

Application.prototype.module = function (name,bootstrap) {
	
	this.modules[name] = bootstrap;
	
	return this;
	
};

Application.prototype.plugin = function (plugin) {
	
	this.plugins.push(plugin);
	
	return this;

};

Application.prototype.runPlugins = function (fn,scope,request,response) {
	
	var application = this, promises = [];
	
	for (var i = 0, length = application.plugins.length; i < length; i++) {
		
		if ('function' === typeof(application.plugins[i][fn])) {
		
			promises.push(application.plugins[i][fn](scope,request,response));
			
		}
		
	}
	
	return Promise.all(promises);
	
};

Application.prototype.service = function (name,service) {
	
	var result = this.injector.service(name,service);
	
	if (service) {
		
		return this;
		
	} else {
		
		return result;
		
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