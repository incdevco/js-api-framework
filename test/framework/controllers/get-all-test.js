var base = process.env.PWD;

var expect = require('expect.js');

var Framework = require(base+'/framework');

describe('Framework.Controller.GetAll',function () {
	
	it('controller.handle',function (done) {
		
		var application = new Framework.Application({}),
			service = new Framework.Service({}),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response(),
			scope = new Framework.Scope(),
			controller = new Framework.Controllers.GetAll({
				application: application,
				cache: 60,
				defaultService: 'test'
			}),
			mock = new Framework.Mock(),
			deferred1 = new Framework.Deferred(),
			deferred2 = new Framework.Deferred(),
			set = new Framework.Set({
				service: service
			});
			
		application.service('test',service);
		
		mock.object(service,{
			name: 'fetchAll',
			'return': deferred1.promise
		});
		
		deferred1.resolve(set);
		
		controller.handle(request,response,scope).then(function () {
			
			try {
				
				expect(response.statusCode).to.be.equal(200);
				expect(response.headers['Cache-Control']).to.be.equal('private, max-age=60');
				expect(response.content).to.be.equal('[]');
				
				mock.done(done);
			
			} catch (error) {
				
				done(error);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception,exception.stack);
			
			done(new Error('controller.handle rejected'));
			
		});
		
	});
	
	it('controller.handle no cahce',function (done) {
		
		var application = new Framework.Application({}),
			service = new Framework.Service({}),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response(),
			scope = new Framework.Scope(),
			controller = new Framework.Controllers.GetAll({
				application: application,
				cache: false,
				defaultService: 'test'
			}),
			mock = new Framework.Mock(),
			deferred1 = new Framework.Deferred(),
			deferred2 = new Framework.Deferred(),
			set = new Framework.Set({
				service: service
			});
			
		application.service('test',service);
		
		mock.object(service,{
			name: 'fetchAll',
			'return': deferred1.promise
		});
		
		deferred1.resolve(set);
		
		controller.handle(request,response,scope).then(function () {
			
			try {
			
				expect(response.statusCode).to.be.equal(200);
				expect(response.headers['Cache-Control']).to.be.equal(undefined);
				expect(response.content).to.be.equal('[]');
				
				mock.done(done);
			
			} catch (error) {
				
				done(error);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception,exception.stack);
			
			done(new Error('controller.handle rejected'));
			
		});
		
	});
	
});