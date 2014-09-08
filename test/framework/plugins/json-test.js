var base = process.env.PWD;

var expect = require('expect.js');

var Framework = require(base+'/framework');

describe('Plugins.Json',function () {
	
	it('beforeRoute',function (done) {
		
		var application = new Framework.Application({}),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response(),
			scope = new Framework.Scope(),
			mock = new Framework.Mock();
		
		Framework.Plugins.Json.beforeRoute(request,response,scope).then(function () {
			
			try {
				
				expect(response.headers).to.be.eql({
					'Content-Type': 'application/json;charset=UTF-8'
				});
				
				done();
				
			} catch (error) {
				
				done(error);
				
			}
				
		});
		
	});
	
});