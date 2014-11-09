var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Controllers.Post',function () {
	
	it('post',function (done) {
		
		var service = new Framework.Service(),
			controller = Framework.Controllers.Post({
				service: 'test'
			}),
			scope = new Framework.Scope(),
			mock = new Framework.Mock(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		mock.mock(service,'service','add')
			.resolve({
				test: 'test'
			});
		
		scope.service('test',service);
		
		controller(scope,request,response).then(function () {
			
			try {
				
				Framework.Expect(response.content).to.be.equal('{"test":"test"}');
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(function (exception) {
			
			return done(exception);
			
		});
		
	});
	
});