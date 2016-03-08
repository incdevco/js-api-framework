var http = require('http');
var qs = require('qs');
var url = require('url');

var Exceptions = require('./exceptions');

function Server(config) {
	
	config = config || {};
	
	this._application = null;
	this._server = null;
	
}

Server.prototype.application = function application(application) {
	
	if (application) {
		
		if ('function' === typeof application) {
			
			application = application();
			
		}
		
		this._application = application;
		
		this._application._bootstrap();
		
		if ('function' === typeof this._application.bootstrap) {
			
			this._application.bootstrap();
			
		}
		
		return this;
		
	}
	
	return this._application;
	
};

Server.prototype.handle = function (request,response) {
	
	var body = '', received = 0, server = this;
	
	request.on('data',function (chunk) {
		
		received += chunk.length;
		
		body += chunk;
		
	});
	
	request.on('error',function (error) {
		
		//console.error('server.handle request error',error);
		
		response.statusCode = 400;
		response.write(error);
		
		response.end();
		
	});
	
	request.on('close',function () {
		
		//console.log('server.handle request close');
		
		response.statusCode = 400;
		response.write('Connection Closed');
		
		response.end();
		
	});
	
	request.on('end',function () {
		
		response.setHeader('content-type','text/html');
		
		if (request.headers['content-type'] && request.headers['content-type'].match('json')) {
			
			try {
				
				request.body = JSON.parse(body);
				
			} catch (error) {
				
				//console.error('server.handle request json body error',error);
				
				response.statusCode = 400;
				response.write('Bad JSON');
				
				return response.end();
				
			}
			
		} else {
				
			request.body = qs.parse(body);
			
		}
		
		request.url = url.parse(request.url);
		
		request.query = qs.parse(request.url.query);
		
		for (var i in request.query) {
			
			if ('null' === request.query[i]) {
			
				request.query[i] = null;
				
			} else if ('false' === request.query[i]) {
			
				request.query[i] = false;
				
			} else if ('true' === request.query[i]) {
			
				request.query[i] = true;
				
			}
			
		}
		
		//server.application().evented(request,response);
		
		server.application().handle(request,response);
		
	});
	
};

Server.prototype.listen = function (port, readyFn) {
	
	var server = this;
	
	this._server = http.createServer(function (request,response) {
		
		server.handle(request,response);
		
	});
	
	this._server.listen(port, readyFn);
	
};

module.exports = Server;