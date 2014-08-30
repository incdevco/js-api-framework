var base = process.env.PWD;

var expect = require('expect.js');

var Framework = require(base+'/framework');

describe('Framework.Controller.Options',function () {
	
	it('controller.handle',function (done) {
		
		var application = new Framework.Application({}),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response(),
			scope = new Framework.Scope(),
			controller = new Framework.Controllers.Options({
				application: application
			});
		
		controller.handle(request,response,scope).then(function () {
			
			try {
			
				expect(response.statusCode).to.be.equal(200);
				expect(response.headers['Access-Control-Allow-Methods']).to.be.equal('DELETE,POST,PUT');
				
				done();
			
			} catch (error) {
				
				done(error);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception,exception.stack);
			
			done(new Error('controller.handle rejected'));
			
		});
		
	});
	
	it('controller.handle with cache',function (done) {
		
		var application = new Framework.Application({}),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response(),
			scope = new Framework.Scope(),
			controller = new Framework.Controllers.Options({
				application: application,
				cache: 60
			});
		
		controller.handle(request,response,scope).then(function () {
			
			try {
			
				expect(response.statusCode).to.be.equal(200);
				expect(response.headers['Cache-Control']).to.be.equal('private, max-age=60');
				expect(response.headers['Access-Control-Allow-Methods']).to.be.equal('DELETE,POST,PUT');
				
				done();
			
			} catch (error) {
				
				done(error);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception,exception.stack);
			
			done(new Error('controller.handle rejected'));
			
		});
		
	});
	
});