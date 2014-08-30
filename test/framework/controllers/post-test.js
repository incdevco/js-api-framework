var base = process.env.PWD;

var expect = require('expect.js');

var Framework = require(base+'/framework');

describe('Framework.Controller.Post',function () {
	
	it('controller.handle',function (done) {
		
		var application = new Framework.Application({}),
			service = new Framework.Service({}),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response(),
			scope = new Framework.Scope(),
			controller = new Framework.Controllers.Post({
				application: application,
				defaultService: 'test'
			}),
			mock = new Framework.Mock(),
			deferred1 = new Framework.Deferred(),
			deferred2 = new Framework.Deferred(),
			model = new Framework.Model({
				service: service
			});
			
		application.service('test',service);
		
		mock.object(service,{
			name: 'fetchNew',
			'return': deferred1.promise
		});
		
		mock.object(model,{
			name: 'save',
			'return': deferred2.promise
		});
		
		deferred1.resolve(model);
		
		deferred2.resolve(model);
		
		controller.handle(request,response,scope).then(function () {
			
			try {
			
				expect(response.statusCode).to.be.equal(201);
				expect(response.content).to.be.equal('{}');
				
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