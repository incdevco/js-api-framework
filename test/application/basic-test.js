var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('basic-application',function () {
	
	var application = new Framework.Application({});
	
	application.when('GET','/test',function (request,response,scope) {
		
		response.statusCode = 200;
		response.write('test');
		
		return Framework.Promise.resolve(true);
		
	});
	
	application.when('GET','/service',function (request,response,scope) {
		
		return scope.service('Service').fetchAll(request.params).then(function (set) {
			
			return set.toJson(scope).then(function (string) {
				
				response.statusCode = 200;
				response.write(string);
				
				return true;
				
			});
			
		});
		
	});
	
	it('/test should resolve controller correctly',function (done) {
		
		var request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response(),
			scope = new Framework.Scope();
		
		request.method = 'GET';
		request.url = '/test';
		
		response.end = function () {
			
			try {
				
				Framework.Expect(response.content).to.be.equal('test');
				
				done();
				
			} catch (error) {
				
				done(error);
					
			}
			
		};
		
		application.handle(request,response,scope);
		
	});
	
	it('/service should use service to get models',function (done) {
		
		var request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response(),
			scope = new Framework.Scope();
		
		request.method = 'GET';
		request.url = '/service';
		
		application.service('Service',{
			fetchAll: function (params) {
				
				var set = new Framework.Set();
				
				set.toJson = function () {
					
					return Framework.Promise.resolve('[{},{}]');
					
				};
				
				return Framework.Promise.resolve(set);
				
			}
		});
		
		response.end = function () {
			
			try {
				
				Framework.Expect(response.content).to.be.equal('[{},{}]');
				
				done();
				
			} catch (error) {
				
				done(error);
					
			}
			
		};
		
		application.handle(request,response,scope);
		
	});
	
});