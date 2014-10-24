var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Controllers.Delete',function () {
	
	it('delete',function (done) {
		
		var resource = new Framework.Resource({
				service: {}
			}),
			controller = Framework.Controllers.Delete,
			scope = new Framework.Scope(),
			mock = new Framework.Mock(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		mock.mock(resource.service,'service','delete').resolve({});
		
		mock.mock(resource.service,'service','toJson').resolve('test');
		
		Framework.Controllers.Delete.call(resource,scope,request,response).then(function () {
			
			try {
				
				Framework.Expect(response.content).to.be.equal('test');
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(function (exception) {
			
			return done(exception);
			
		});
		
	});
	
});