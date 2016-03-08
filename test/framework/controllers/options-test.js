var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Controllers.Options',function () {
	
	it('options',function (done) {
		
		var controller = Framework.Controllers.Options(),
			scope = new Framework.Scope(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		controller(scope,request,response).then(function () {
			
			try {
				
				Framework.Expect(response.headers).to.be.eql({
					'Access-Control-Allow-Methods':'DELETE,GET,POST,PUT'
				});
				
				return done();
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(function (exception) {
			
			return done(exception);
			
		});
		
	});
	
});