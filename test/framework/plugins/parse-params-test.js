var base = process.env.PWD;

var expect = require('expect.js');

var Framework = require(base+'/framework');

describe('Plugins.ParseParams',function () {
	
	it('afterRoute',function (done) {
		
		var application = new Framework.Application({}),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response(),
			scope = new Framework.Scope(),
			mock = new Framework.Mock();
		
		request.params = {
			test: 'test',
			limit: 10,
			offset: 50
		};
		
		Framework.Plugins.ParseParams.afterRoute(request,response,scope).then(function () {
			
			try {
				
				expect(request.params).to.be.eql({
					test: 'test'
				});
				expect(request.limit).to.be.equal(10);
				expect(request.offset).to.be.equal(50);
				
				done();
				
			} catch (error) {
				
				done(error);
				
			}
				
		});
		
	});
	
	it('afterRoute without params',function (done) {
		
		var application = new Framework.Application({}),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response(),
			scope = new Framework.Scope(),
			mock = new Framework.Mock();
		
		Framework.Plugins.ParseParams.afterRoute(request,response,scope).then(function () {
			
			try {
				
				expect(request.params).to.be.equal(undefined);
				
				done();
				
			} catch (error) {
				
				done(error);
				
			}
				
		});
		
	});
	
	it('afterRoute without limit and offset',function (done) {
		
		var application = new Framework.Application({}),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response(),
			scope = new Framework.Scope(),
			mock = new Framework.Mock();
		
		request.params = {};
		
		Framework.Plugins.ParseParams.afterRoute(request,response,scope).then(function () {
			
			try {
				
				expect(request.params).to.be.eql({});
				
				done();
				
			} catch (error) {
				
				done(error);
				
			}
				
		});
		
	});
	
});