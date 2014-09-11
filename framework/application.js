var base = process.env.PWD;

var bunyan = require('bunyan');
var objectMerge = require('object-merge');

var Cache = require('./cache');
var Injector = require('./injector');
var Moment = require('./moment');
var NotFound = require('./exceptions/not-found');
var Plugins = require('./plugins');
var Promise = require('./promise');
var Route = require('./route');
var Scope = require('./scope');

function Application (config) {
	
	this.injector = config.injector || new Injector();
	this.log = config.log || bunyan.createLogger({
		name: 'app',
		level: 'trace'
	});
	this.plugins = [
		Plugins.ParseUrl,
		Plugins.ParseBody
	];
	this.routes = [];
	
}

Application.prototype.afterController = function (request,response,scope) {
	
	return this.runPlugins('afterController',request,response,scope);
	
};

Application.prototype.afterRoute = function (request,response,scope) {
	
	return this.runPlugins('afterRoute',request,response,scope);
	
};

Application.prototype.beforeController = function (request,response,scope) {
	
	return this.runPlugins('beforeController',request,response,scope);
	
};

Application.prototype.beforeRoute = function (request,response,scope) {
	
	return this.runPlugins('beforeRoute',request,response,scope);
	
};

Application.prototype.handle = function (request,response) {
	
	var app, scope;
	
	console.log('New Request',request.method,request.url);
	
	app = this;
	
	scope = new Scope({
		cache: new Cache(),
		injector: new Injector(this.injector),
		response: response,
		time: Moment()
	});
	
	scope.timeout = setTimeout(function () {
		
		response.statusCode = 500;
		response.write('Request Timed Out');
		response.end();
		
		scope.close();
		
	}, 30000);
	
	app.beforeRoute(request,response,scope).then(function () {
		
		//console.log('beforeRoute',request.method,request.url);
		
		scope.route = app.match(request);
		
		if (scope.route) {
			
			request.params = objectMerge(request.query,scope.route.params);
			
			return app.afterRoute(request,response,scope).then(function () {
				
				//console.log('afterRoute',request.method,request.url);
				
				return app.beforeController(request,response,scope).then(function () {
					
					//console.log('beforeController',request.method,request.url);
					
					return scope.route.controller(request,response,scope).then(function () {
						
						//console.log('controller',request.method,request.url);
						
						return app.afterController(request,response,scope).then(function () {
							
							//console.log('afterController',request.method,request.url);
							
							response.statusCode = response.statusCode || 200;
							
							response.end();
							
							scope.close();
							
							return true;
							
						})
						
					});
					
				});
				
			});
			
		} else {
			
			console.error('No Route Found');
			
			throw new NotFound();
			
		}
		
	}).catch(function (exception) {
		
		console.error('Exception Occurred',request.method,request.url.path,exception,exception.stack);
		
		response.statusCode = exception.statusCode || 500;
		response.write(exception.content || JSON.stringify(exception));
		response.end();
		
		scope.close();
		
	});
	
};

Application.prototype.match = function (request) {
	
	var promises = [];
	
	if (request.method in this.routes) {
		
		//console.log('Application.match',request.method,request.url);
		
		for (var i = 0, length = this.routes[request.method].length; i < length; i++) {
			
			//console.log('Application.match trying route',this.routes[request.method][i]);
			
			var result = this.routes[request.method][i].match(request.url);
			
			if (result) {
				
				return result;
				
			}
			
		}
		
		return false;
		
	} else {
		
		console.log('Method Not Implemented: '+request.method);
		
		return false;
		
	}
};

Application.prototype.plugin = function (plugin) {
	
	this.plugins.push(plugin);
	
	return this;

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