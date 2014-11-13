var base = process.env.PWD;

var fs = require('fs');
var util = require('util');

var objectMerge = require('object-merge');

var Cache = require('./cache');
var Injector = require('./injector');
var Exceptions = require('./exceptions');
var Module = require('./module');
var Moment = require('./moment');
var Numeral = require('./numeral');
var Promise = require('./promise');
var Route = require('./route');
var Scope = require('./scope');

function Application (config) {
	
	var application = this;
	
	config = config || {};
		
	config.injector = config.injector || new Injector();
		
	config.modules = config.modules || {};
	
	config.plugins = config.plugins || {};
		
	this.injector = config.injector;
	this.modules = {};
	this.plugins = {};
	this._plugins = {
		afterController: undefined,
		afterRoute: undefined,
		beforeController: undefined,
		beforeRoute: undefined
	}
	this.routes = {};
	this.services = {};
	
	Object.keys(config.modules).forEach(function (name) {
		
		application.module(name,config.modules[name]);
		
	});
	
	Object.keys(config.plugins).forEach(function (name) {
		
		application.plugin(name,config.plugins[name]);
		
	});
	
	if (config.services) {
		
		Object.keys(config.services).forEach(function (name) {
			
			application.service(name,config.services[name]);
			
		});
		
	}
	
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

Application.prototype._bootstrap = function () {
	
	var application = this,
		afterController = [], 
		afterRoute = [], 
		beforeController = [], 
		beforeRoute = [];
	
	Object.keys(application.modules).forEach(function (module) {
		
		application.modules[module]._bootstrap(application);
		
		if ('function' === typeof application.modules[module].bootstrap) {
		
			application.modules[module].bootstrap(application);
		
		}
		
	});
	
	Object.keys(application.services).forEach(function (service) {
		
		application.services[service]._bootstrap(application);
		
		if ('function' === typeof application.services[service].bootstrap) {
			
			application.services[service].bootstrap(application);
			
		}
		
	});
	
	Object.keys(application.plugins).forEach(function (plugin) {
		
		if ('function' === typeof application.plugins[plugin].afterController) {
			
			afterController.push(application.plugins[plugin].afterController);
			
		}
		
		if ('function' === typeof application.plugins[plugin].afterRoute) {
			
			afterRoute.push(application.plugins[plugin].afterRoute);
			
		}
		
		if ('function' === typeof application.plugins[plugin].beforeController) {
			
			beforeController.push(application.plugins[plugin].beforeController);
			
		}
		
		if ('function' === typeof application.plugins[plugin].beforeRoute) {
			
			beforeRoute.push(application.plugins[plugin].beforeRoute);
			
		}
		
	});
	
	application._plugins.afterController = new Array(afterController.length);
	
	for (var i = 0; i < afterController.length; i++) {
		
		application._plugins.afterController[i] = afterController[i];
		
	}
	
	application._plugins.afterRoute = new Array(afterRoute.length);
	
	for (var i = 0; i < afterRoute.length; i++) {
		
		application._plugins.afterRoute[i] = afterRoute[i];
		
	}
	
	application._plugins.beforeController = new Array(beforeController.length);
	
	for (var i = 0; i < beforeController.length; i++) {
		
		application._plugins.beforeController[i] = beforeController[i];
		
	}
	
	application._plugins.beforeRoute = new Array(beforeRoute.length);
	
	for (var i = 0; i < beforeRoute.length; i++) {
		
		application._plugins.beforeRoute[i] = beforeRoute[i];
		
	}
	
	console.log('Application Ready');
	
	return this;
	
};

Application.prototype.evented = function (request,response) {
	
	var application = this, 
		scope = new Scope({
			cache: new Cache(),
			services: application.services,
			time: Moment()
		});
	
	response.on('exception',function (exception) {
		
		console.error(exception,exception.stack);
		
		response.statusCode = 500;
		response.write(exception.message);
		
		response.end();
		
	});
	
	request.on('beforeRoute',function () {
		
		//console.log('beforeRoute');
		
		application.beforeRoute(scope,request,response).then(function () {
			
			request.emit('route');
			
			return true;
			
		}).catch(function (exception) {
			
			response.emit('exception',exception);
			
			return true;
			
		});
		
	});
	
	request.on('route',function () {
		
		//console.log('route');
		
		application.match(scope,request).then(function () {
			
			request.emit('afterRoute');
			
			return true;
			
		}).catch(function (exception) {
			
			response.emit('exception',exception);
			
			return true;
			
		});
		
	});
	
	request.on('afterRoute',function () {
		
		//console.log('afterRoute');
		
		if (scope.route) {
			
			request.emit('beforeController');
			
		} else {
			
			request.emit('final');
			
		}
		
	});
	
	request.on('beforeController',function () {
		
		//console.log('beforeController');
		
		application.beforeController(scope,request,response).then(function () {
			
			request.emit('controller');
			
			return true;
			
		}).catch(function (exception) {
			
			response.emit('exception',exception);
			
			return true;
			
		});
		
	});
	
	request.on('controller',function () {
		
		//console.log('controller');
		
		scope.route.controller(scope,request,response).then(function () {
			
			request.emit('afterController');
			
			return true;
			
		}).catch(function (exception) {
			
			response.emit('exception',exception);
			
			return true;
			
		});
		
	});
	
	request.on('afterController',function () {
		
		//console.log('afterController');
		
		application.afterController(scope,request,response).then(function () {
			
			request.emit('final');
			
			return true;
			
		}).catch(function (exception) {
			
			response.emit('exception',exception);
			
			return true;
			
		});
		
	});
	
	// executed after afterController || afterRoute, but before response.final
	request.on('final',function () {
		
		//console.log('request final');
			
		response.emit('final');
			
		return true;
		
	});
	
	// executed before sending response
	response.on('final',function () {
		
		//console.log('response final');
		
		// Success
		response.statusCode = response.statusCode || 200;
		response.end();
		
		return true;
		
	});
	
	request.emit('beforeRoute');
	
};

Application.prototype.get = function get(name) {
	
	return this.injector.get(name);
	
};

Application.prototype.handle = function (request,response) {
	
	var application = this, 
		scope = new Scope({
			cache: new Cache(),
			services: application.services,
			time: Moment()
		});
	
	application.beforeRoute(scope,request,response)
		.then(function () {
			
			return application.match(scope,request)
				.then(function () {
					
					return application.afterRoute(scope,request,response);
					
				})
				.then(function () {
					
					if (scope.route) {
						
						return application.beforeController(scope,request,response)
							.then(function () {
								
								return scope.route.controller(scope,request,response);
								
							})
							.then(function () {
								
								return application.afterController(scope,request,response);
								
							});
						
					} else {
						
						console.error('no route found');
						
						throw new Exceptions.NotFound();
						
					}
					
				});
			
		})
		.catch(Exceptions.NotAllowed,function notAllowed(exception) {
			
			response.statusCode = 403;
			response.write('Not Allowed');
			
			return true;
			
		})
		.catch(Exceptions.NotFound,function notFound(exception) {
			
			response.statusCode = 404;
			response.write('Not Found');
			
			return true;
			
		})
		.catch(Exceptions.NotValid,function notValid(exception) {
			
			response.statusCode = 400;
			response.write('Not Valid');
			
			return true;
			
		})
		.catch(function exception(exception) {
			
			console.error('Exception Occurred',request.method,request.url.path,exception,exception.stack);
			
			response.statusCode = 500;;
			response.write('An Exception Occurred');
			
			return true;
			
		})
		.finally(function () {
			
			response.end();
			
			return true;
			
		});
	
};

Application.prototype.match = function (scope,request) {
	
	var paths = Object.keys(this.routes),
		promises = new Array(paths.length);
	
	for (var i = 0, length; i < paths.length; i++) {
		
		if (this.routes[paths[i]].controllers[request.method]) {
		
			//promises.push(this.routes[paths[i]].match(scope,request));
			
			promises[i] = this.routes[paths[i]].match(scope,request);
			
		}
		
	}
	
	return Promise.any(promises)
		.catch(function () {
			
			return true;
			
		});
	
};

Application.prototype.module = function (name,module) {
	
	if ('function' === typeof module) {
		
		module = module();
		
	}
	
	this.modules[name] = module;
	
	return this;
	
};

Application.prototype.plugin = function (name,plugin) {
	
	if ('function' === typeof plugin) {
		
		plugin = plugin();
		
	}
	
	this.plugins[name] = plugin;
	
	return this;

};

Application.prototype.runPlugins = function (fn,scope,request,response) {
	
	var application = this, 
		promises = new Array(this._plugins[fn].length);
	
	for (var i = 0; i < this._plugins[fn].length; i++) {
		
		promises[i] = this._plugins[fn][i](scope,request,response);
		
	}	
	
	/*
	Object.keys(application.plugins).forEach(function (name) {
		
		if ('function' === typeof(application.plugins[name][fn])) {
			
			promises.push(application.plugins[name][fn](scope,request,response));
			
		}
		
	});
	*/
	return Promise.all(promises);
	
};

Application.prototype.service = function (name,service) {
	
	if (service) {
		
		if ('function' === typeof service) {
			
			service = service();
			
		}
		
		this.services[name] = service;
		
		return this;
		
	} else {
		
		return this.services[name];
		
	}
	
};

Application.prototype.set = function set(name,item) {
	
	return this.injector.set(name,item);
	
};

Application.prototype.when = function (path,controllers,context) {
	
	this.routes[path] = new Route(path,controllers,context);
	
	return this;
	
};

module.exports = Application;