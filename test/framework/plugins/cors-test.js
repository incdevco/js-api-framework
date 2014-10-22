var base = process.env.PWD;

var expect = require('chai').expect;

var Framework = require(base+'/framework');

var Cors = require(base+'/framework/plugins/cors');

describe('Framework.Plugins.Cors',function () {
	
	it('plugin.beforeRoute',function (done) {
		
		var request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response(),
			scope = new Framework.Scope(),
			plugin = new Framework.Plugins.Cors({
				allowHeaders: ['test'],
				exposeHeaders: ['test'],
				origin: 'test'
			});
		
		plugin.beforeRoute(scope,request,response).then(function () {
			
			try {
				
				expect(response.headers['Access-Control-Allow-Origin']).to.be.equal('test');
				expect(response.headers['Access-Control-Allow-Headers']).to.be.equal('test');
				expect(response.headers['Access-Control-Expose-Headers']).to.be.equal('test');
				
				done();
				
			} catch (error) {
				
				done(error);
				
			}
			
		});
		
	});
	
});