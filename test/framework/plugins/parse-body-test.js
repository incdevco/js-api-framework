var base = process.env.PWD;

var expect = require('expect.js');

var Framework = require(base+'/framework');

describe('Plugins.ParseBody',function () {
	
	it('beforeRoute with mock',function (done) {
		
		var application = new Framework.Application({}),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response(),
			scope = new Framework.Scope(),
			mock = new Framework.Mock();
		
		Framework.Plugins.ParseBody.beforeRoute(request,response,scope).then(function () {
			
			try {
				
				expect(request.body).to.be.equal(undefined);
				
				done();
				
			} catch (error) {
				
				done(error);
				
			}
				
		});
		
	});
	
});