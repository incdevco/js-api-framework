var base = process.env.PWD;

var expect = require('expect.js');

var Framework = require(base+'/framework');

describe('Framework.Application',function () {
	
	it('application.controller',function () {
		
		var application = new Framework.Application({}),
			controller = function (request,response,scope) {};
		
		application.controller('test',controller);
		
		expect(application.controller('test')).to.be.equal(controller);
		
	});
	
	it('application.handle',function (done) {
		
		var application = new Framework.Application({}),
			controller = {},
			deferred1 = new Framework.Deferred(),
			deferred2 = new Framework.Deferred(),
			deferred3 = new Framework.Deferred(),
			deferred4 = new Framework.Deferred(),
			mock = new Framework.Mock(),
			plugin = {},
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		request.url = '/test/12345'
		
		mock.object(controller,{
			name: 'handle',
			'return': deferred1.promise
		});
		
		mock.object(plugin,{
			name: 'after',
			'return': deferred2.promise
		});
		
		mock.object(plugin,{
			name: 'afterRoute',
			'return': deferred3.promise
		});
		
		mock.object(plugin,{
			name: 'before',
			'return': deferred4.promise
		});
		
		application.controller('TestController',controller);
		
		application.when('GET','/test/:id','TestController');
		
		application.plugin(new Framework.Plugins.ParseUrl());
		application.plugin(plugin);
		
		deferred1.resolve(true);
		
		deferred2.resolve(true);
		
		deferred3.resolve(true);
		
		deferred4.resolve(true);
		
		response.end = function () {
			
			try {
				
				expect(this.statusCode).to.be.equal(200);
				expect(this.content).to.be.equal('');
				
				done();
				
			} catch (exception) {
				
				done(exception);
				
			}
			
		};
		
		application.handle(request,response);
		
	});
	
	it('application.handle without controller',function (done) {
		
		var application = new Framework.Application({}),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		application.when('GET','/','TestController');
		
		response.end = function () {
			
			try {
				
				expect(this.statusCode).to.be.equal(404);
				expect(this.content).to.be.equal('Not Found');
				
				done();
				
			} catch (exception) {
				
				done(exception);
				
			}
			
		};
		
		application.handle(request,response);
		
	});
	
	it('application.handle no match',function (done) {
		
		var application = new Framework.Application({}),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		response.end = function () {
			
			try {
				
				expect(this.statusCode).to.be.equal(404);
				expect(this.content).to.be.equal('Not Found');
				
				done();
				
			} catch (exception) {
				
				done(exception);
				
			}
			
		};
		
		application.handle(request,response);
		
	});
	
	it('application.handle no path match',function (done) {
		
		var application = new Framework.Application({}),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		application.when('GET','/test','TestController');
		
		response.end = function () {
			
			try {
				
				expect(this.statusCode).to.be.equal(404);
				expect(this.content).to.be.equal('Not Found');
				
				done();
				
			} catch (exception) {
				
				done(exception);
				
			}
			
		};
		
		application.handle(request,response);
		
	});
	
	it('application.resource',function () {
		
		var app = new Framework.Application({}), 
			resource = new Framework.Resource({
				path: '/'
			});
		
		app.resource(resource);
		
	});
	
});