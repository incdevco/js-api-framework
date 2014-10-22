var http = require('http');
var qs = require('qs');
var url = require('url');

function Server(config) {
	
	this.application = null;
	this._server = null;
	
}

Server.prototype.handle = function (request,response) {
	
	var body = '', received = 0, server = this;
	
	request.on('data',function (chunk) {
		
		received += chunk.length;
		
		body += chunk;
		
	});
	
	request.on('error',function (error) {
		
		console.error('server.handle request error',error);
		
	});
	
	request.on('close',function () {
		
		console.log('server.handle request close');
		
	});
	
	request.on('end',function () {
		
		if (request.headers['content-type'] && request.headers['content-type'].match('json')) {
			
			try {
				
				request.body = JSON.parse(body);
				
			} catch (error) {
				
				console.error('server.handle request json body error',error);
				
			}
			
		} else {
			
			try {
				
				request.body = qs.parse(body);
				
			} catch (error) {
				
				console.error('server.handle request qs body error',error);
				
			}
			
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
		
		server.application.handle(request,response);
		
	});
	
};

Server.prototype.listen = function (port) {
	
	var server = this;
	
	this._server = http.createServer(function (request,response) {
		
		server.handle(request,response);
		
	});
	
	this._server.listen(port);
	
};

module.exports = Server;