var base = process.env.PWD;

var expect = require('chai').expect;

var Framework = require(base+'/framework');

describe('Framework.Plugins.LimitOffset',function () {
	
	it('afterRoute',function (done) {
		
		var application = new Framework.Application({}),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response(),
			scope = new Framework.Scope(),
			mock = new Framework.Mock(),
			plugin = new Framework.Plugins.LimitOffset();
		
		request.query = {
			test: 'test',
			limit: 10,
			offset: 50
		};
		
		plugin.afterRoute(scope,request,response).then(function () {
			
			try {
				
				expect(request.query).to.be.eql({
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
			mock = new Framework.Mock(),
			plugin = new Framework.Plugins.LimitOffset();
		
		plugin.afterRoute(scope,request,response).then(function () {
			
			try {
				
				expect(request.query).to.be.eql({});
				
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
			mock = new Framework.Mock(),
			plugin = new Framework.Plugins.LimitOffset();
		
		request.query = {};
		
		plugin.afterRoute(scope,request,response).then(function () {
			
			try {
				
				expect(request.query).to.be.eql({});
				
				done();
				
			} catch (error) {
				
				done(error);
				
			}
				
		});
		
	});
	
	it('afterRoute without query',function (done) {
		
		var application = new Framework.Application({}),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response(),
			scope = new Framework.Scope(),
			mock = new Framework.Mock(),
			plugin = new Framework.Plugins.LimitOffset();
		
		delete request.query;
		
		plugin.afterRoute(scope,request,response).then(function () {
			
			try {
				
				expect(request.query).to.be.equal(undefined);
				expect(request.limit).to.be.equal(undefined);
				expect(request.offset).to.be.equal(undefined);
				
				done();
				
			} catch (error) {
				
				done(error);
				
			}
				
		});
		
	});
	
});