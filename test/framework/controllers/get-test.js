var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Controllers.Get',function () {
	
	it('fetchAll',function (done) {
		
		var resource = new Framework.Resource({
				id: 'id',
				service: {}
			}),
			scope = new Framework.Scope(),
			mock = new Framework.Mock(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		mock.mock(resource.service,'service','fetchAll').resolve({});
		
		mock.mock(resource.service,'service','toJson').resolve('test');
		
		Framework.Controllers.Get.call(resource,scope,request,response).then(function () {
			
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
	
	it('fetchOne',function (done) {
		
		var resource = new Framework.Resource({
				id: 'id',
				service: {}
			}),
			scope = new Framework.Scope(),
			mock = new Framework.Mock(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		request.query.id = 'test';
		
		mock.mock(resource.service,'service','fetchOne').resolve({});
		
		mock.mock(resource.service,'service','toJson').resolve('test');
		
		Framework.Controllers.Get.call(resource,scope,request,response).then(function () {
			
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