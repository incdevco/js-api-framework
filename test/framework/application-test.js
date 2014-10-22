var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Application',function () {
	
	it('handle with no route',function (done) {
		
		var application = new Framework.Application(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		application.when('GET','/test',function (scope,request,response) {
			
			response.write('test');
			
			return Framework.Promise.resolve(true);
			
		});
		
		application.handle(request,response);
		
		response.on('end',function () {
			
			try {
			
				Framework.Expect(response.content).to.be.equal('Not Found');
			
				done();
				
			} catch (error) {
				
				done(error);
				
			}
			
		});
		
	});
	
	it('handle with route',function (done) {
		
		var application = new Framework.Application(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		application.when('GET','/',function (scope,request,response) {
			
			response.write('test');
			
			return Framework.Promise.resolve(true);
			
		});
		
		application.when('GET','/test',function (scope,request,response) {
			
			response.write('test');
			
			return Framework.Promise.resolve(true);
			
		});
		
		application.handle(request,response);
		
		response.on('end',function () {
			
			try {
				
				Framework.Expect(response.content).to.be.equal('test');
			
				return done();
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
	it('handle with no method',function (done) {
		
		var application = new Framework.Application(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		application.handle(request,response);
		
		response.on('end',function () {
			
			try {
			
				Framework.Expect(response.content).to.be.equal('Not Found');
			
				done();
				
			} catch (error) {
				
				done(error);
				
			}
			
		});
		
	});
	
	it('handle with plugin',function (done) {
		
		var application = new Framework.Application(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		application.when('GET','/',function (scope,request,response) {
			
			response.write('test');
			
			return Framework.Promise.resolve(true);
			
		});
		
		application.plugin({
			afterRoute: function (scope,request,response) {
				
				response.write('afterRoute');
				
				return Framework.Promise.resolve(true);
				
			},
			afterController: function (scope,request,response) {
				
				response.write('afterController');
				
				return Framework.Promise.resolve(true);
				
			},
			beforeRoute: function (scope,request,response) {
				
				response.write('beforeRoute');
				
				return Framework.Promise.resolve(true);
				
			},
			beforeController: function (scope,request,response) {
				
				response.write('beforeController');
				
				return Framework.Promise.resolve(true);
				
			}
		});
		
		application.plugin({
			afterRoute: 'test'
		});
		
		application.handle(request,response);
		
		response.on('end',function () {
			
			try {
				
				Framework.Expect(response.content).to.be.equal('beforeRouteafterRoutebeforeControllertestafterController');
			
				return done();
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
	it('service with name',function () {
		
		var application = new Framework.Application(),
			name = 'test',
			service = {test:'test'};
		
		application.service(name,service);
		
		Framework.Expect(application.service(name)).to.be.eql(service);
		
	});
	
	it('handle with route with params',function (done) {
		
		var application = new Framework.Application(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		request.url = {
			pathname:'/test/12345'
		};
		
		application.when('GET','/test/:id',function (scope,request,response) {
			
			response.write('test');
			
			return Framework.Promise.resolve(true);
			
		});
		
		application.handle(request,response);
		
		response.on('end',function () {
			
			try {
				
				Framework.Expect(request.params).to.be.eql({
					id: '12345'
				});
				
				Framework.Expect(response.content).to.be.equal('test');
			
				return done();
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
	it('module and bootstrap',function () {
		
		var application = new Framework.Application();
		
		application.module('test',function (application) {
			
			application.service('test','test');
			
		});
		
		Framework.Expect(application.service('test')).to.be.equal(undefined);
		
		application.bootstrap();
		
		Framework.Expect(application.service('test')).to.be.equal('test');
		
	});
	
});