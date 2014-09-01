var base = process.env.PWD;

var expect = require('expect.js');

var Framework = require(base+'/framework');

describe('Framework.Application',function () {
	
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
		
		application.when('GET','/test/:id',controller.handle);
		
		application.plugin(plugin);
		
		deferred1.resolve(true);
		
		deferred2.resolve(true);
		
		deferred3.resolve(true);
		
		deferred4.resolve(true);
		
		response.end = function () {
			
			try {
				
				Framework.Expect(this.statusCode).to.be.equal(200);
				Framework.Expect(this.content).to.be.equal('');
				
				done();
				
			} catch (exception) {
				
				done(exception);
				
			}
			
		};
		
		application.handle(request,response);
		
	});
	
});