var base = process.env.PWD;

var expect = require('chai').expect;

var Framework = require(base+'/framework');

describe('Framework.Plugins.Json',function () {
	
	it('beforeRoute',function (done) {
		
		var application = new Framework.Application({}),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response(),
			scope = new Framework.Scope(),
			mock = new Framework.Mock(),
			plugin = new Framework.Plugins.Json;
		
		plugin.beforeRoute(scope,request,response).then(function () {
			
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