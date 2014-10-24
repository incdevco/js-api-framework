var objectMerge = require('object-merge');

var Cache = require('./cache');
var Injector = require('./injector');
var Module = require('./module');
var Moment = require('./moment');
var NotFound = require('./exceptions/not-found');
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
	this.routes = {};
	
	for (var i in config.modules) {
		
		application.module(i,config.modules[i]);
		
	}
	
	for (var i in config.plugins) {
		
		application.plugin(i,config.plugins[i]);
		
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

Application.prototype.bootstrap = function () {
	
	var application = this;
	
	Object.keys(application.modules).forEach(function (module) {
		
		application.modules[module].bootstrap();
		
	});
	
	return this;
	
};

Application.prototype.handle = function (request,response) {
	
	var application = this, 
		scope = new Scope({
			cache: new Cache(),
			injector: new Injector(this.injector),
			time: Moment()
		});
	
	application.beforeRoute(scope,request,response).then(function () {
		
		return application.match(scope,request).then(function () {
			
			return application.afterRoute(scope,request,response).then(function () {
				
				var promise;
				
				if (scope.route) {
					
					promise = application.beforeController(scope,request,response).then(function () {
						
						return scope.route.controller(scope,request,response).then(function () {
							
							return application.afterController(scope,request,response);
							
						});
						
					});
					
				} else {
					
					promise = Promise.reject(false);
					
				}
				
				return promise.then(function () {
					
					// Success
					response.statusCode = response.statusCode || 200;
					response.end();
					
					return true;
					
				}).catch(function (exception) {
					
					// Exception From Controller Loop
					
					//console.log('controller loop exception',exception,exception.stack);
					
					throw exception;
					
				});
				
			}).catch(function (exception) {
				
				// Exception After Route
				
				//console.log('after route exception',exception,exception.stack);
				
				throw exception;
				
			});
			
		}).catch(function (exception) {
			
			// Exception No Match
			
			//console.log('no route exception',exception,exception.stack);
			
			throw {
				statusCode: 404,
				content: 'Not Found'
			};
			
		});
		
	}).catch(function (exception) {
		
		//console.error('Exception Occurred',request.method,request.url.path,exception,exception.stack);
		
		response.statusCode = exception.statusCode;
		response.write(exception.content);
		response.end();
		
		return true;
		
	});
	
};

Application.prototype.evented = function (request,response) {
	
	var application = this, 
		scope = new Scope({
			cache: new Cache(),
			injector: new Injector(this.injector),
			time: Moment()
		});
	
	response.on('exception',function (exception) {
		
		response.statusCode = 500;
		response.write(exception);
		
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

Application.prototype.match = function (scope,request) {
	
	var paths = Object.keys(this.routes),
		promises = [];
	
	for (var i = 0, length = paths.length; i < length; i++) {
		
		promises.push(this.routes[paths[i]].match(scope,request));
		
	}
	
	if (promises.length === 0) {
		
		return Promise.resolve(true);
		
	}
	
	return Promise.any(promises);
	
};

Application.prototype.module = function (name,module) {
	
	if ('function' === typeof module) {
		
		module = module();
		
	}
	
	module.application = this;
	
	this.injector.module(name,module);
	
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
	
	var application = this, promises = [];
	
	Object.keys(application.plugins).forEach(function (name) {
		
		if ('function' === typeof(application.plugins[name][fn])) {
			
			promises.push(application.plugins[name][fn](scope,request,response));
			
		}
		
	});
	
	return Promise.all(promises);
	
};

Application.prototype.service = function (name,service) {
	
	if ('function' === typeof service) {
		
		service = service();
		
	}
	
	var result = this.injector.service(name,service);
	
	if (service) {
		
		return this;
		
	} else {
		
		return result;
		
	}
	
};

Application.prototype.when = function (path,controllers,context) {
	
	this.routes[path] = new Route(path,controllers,context);
	
	return this;
	
};

module.exports = Application;