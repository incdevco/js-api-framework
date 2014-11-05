var base = process.env.PWD;
var http = require('http');

var Framework = require(base+'/framework');

describe('Framework.Server',function () {
	
	it('application',function (done) {
		
		var mock = new Framework.Mock(),
			server = new Framework.Server();
		
		server.application(function () {
			
			var application = new Framework.Application();
			
			mock.mock(application,'application','bootstrap')
				.return(true);
				
			return application;
			
		});
		
		mock.done(done);
		
	});
	
	it('handle',function (done) {
		
		var server = new Framework.Server(),
			application = new Framework.Application(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		application.when('/',{
			GET: function (scope,request,response) {
				
				response.write('test');
				
				return Framework.Promise.resolve(true);
				
			}
		});
		
		server.application(application);
		
		server.handle(request,response);
		
		request.data('test=test');
		
		request.end();
		
		response.on('end',function () {
			
			try {
				
				Framework.Expect(request.body).to.be.eql({
					test: 'test'
				});
				
				Framework.Expect(response.content).to.be.equal('test');
				
				done();
				
			} catch (error) {
				
				done(error);
				
			}
			
		});
		
	});
	
	it('handle with json',function (done) {
		
		var server = new Framework.Server(),
			application = new Framework.Application(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		application.when('/',{
			GET: function (scope,request,response) {
				
				response.write('test');
				
				return Framework.Promise.resolve(true);
				
			}
		});
		
		server.application(application);
		
		request.headers['content-type'] = 'application/json';
		
		server.handle(request,response);
		
		request.data('{"test":"test"}');
		
		request.end();
		
		response.on('end',function () {
			
			try {
				
				Framework.Expect(request.body).to.be.eql({
					test: 'test'
				});
				
				Framework.Expect(response.content).to.be.equal('test');
				
				done();
				
			} catch (error) {
				
				done(error);
				
			}
			
		});
		
	});
	
	it('handle with bad json',function (done) {
		
		var server = new Framework.Server(),
			application = new Framework.Application(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		server.application(application);
		
		request.headers['content-type'] = 'application/json';
		
		response.on('end',function () {
			
			try {
				
				Framework.Expect(request.body).to.be.equal(undefined);
				
				Framework.Expect(response.statusCode).to.be.equal(400);
				
				Framework.Expect(response.content).to.be.equal('Bad JSON');
				
				done();
				
			} catch (error) {
				
				done(error);
				
			}
			
		});
		
		server.handle(request,response);
		
		request.data('"test":"test"}');
		
		request.end();
		
	});
	
	it('handle with query with null, false and true',function (done) {
		
		var server = new Framework.Server(),
			application = new Framework.Application(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		request.url = '/?test_null=null&test_false=false&test_true=true&test_string=string';
		
		application.when('/',{
			GET: function (scope,request,response) {
				
				response.write('test');
				
				return Framework.Promise.resolve(true);
				
			}
		});
		
		server.application(application);
		
		server.handle(request,response);
		
		request.end();
		
		response.on('end',function () {
			
			try {
				
				Framework.Expect(request.query).to.be.eql({
					test_null: null,
					test_false: false,
					test_true: true,
					test_string: 'string'
				});
				
				Framework.Expect(response.content).to.be.equal('test');
				
				done();
				
			} catch (error) {
				
				done(error);
				
			}
			
		});
		
	});
	
	it('listen',function (done) {
		
		var server = new Framework.Server(),
			application = new Framework.Application(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		application.when('/',{
			GET: function (scope,request,response) {
				
				response.write('test');
				
				return Framework.Promise.resolve(true);
				
			}
		});
		
		server.application(application);
		
		server.listen(9090);
		
		Framework.Expect(server._server instanceof http.Server).to.be.equal(true);
		
		Framework.Expect(server._server.address().port).to.be.equal(9090);
		
		server._server.emit('request',request,response);
		
		request.data('test=test');
		
		request.end();
		
		response.on('end',function () {
			
			try {
				
				Framework.Expect(request.body).to.be.eql({
					test: 'test'
				});
				
				Framework.Expect(response.content).to.be.equal('test');
				
				done();
				
			} catch (error) {
				
				done(error);
				
			}
			
			server._server.close();
			
		});
		
	});
	
	it('handle with close',function (done) {
		
		var server = new Framework.Server(),
			application = new Framework.Application(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		application.when('GET','/',function (scope,request,response) {
			
			response.write('test');
			
			return Framework.Promise.resolve(true);
			
		});
		
		server.application = application;
		
		request.data('test=test');
		
		response.on('end',function () {
			
			try {
				
				Framework.Expect(request.body).to.be.eql(undefined);
				
				Framework.Expect(response.content).to.be.equal('Connection Closed');
				
				done();
				
			} catch (error) {
				
				done(error);
				
			}
			
		});
		
		server.handle(request,response);
		
		request.close();
		
	});
	
	it('handle with error',function (done) {
		
		var server = new Framework.Server(),
			application = new Framework.Application(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		application.when('GET','/',function (scope,request,response) {
			
			response.write('test');
			
			return Framework.Promise.resolve(true);
			
		});
		
		server.application = application;
		
		request.data('test=test');
		
		response.on('end',function () {
			
			try {
				
				Framework.Expect(request.body).to.be.eql(undefined);
				
				Framework.Expect(response.content).to.be.equal('Error: error');
				
				done();
				
			} catch (error) {
				
				done(error);
				
			}
			
		});
		
		server.handle(request,response);
		
		request.error(new Error('error'));
		
	});
	
});