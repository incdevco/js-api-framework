var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Application',function () {
	
	it('handle with route',function (done) {
		
		var application = new Framework.Application(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		application.when('/',{
			GET: function (scope,request,response) {
				
				response.write('homepage');
				
				return Framework.Promise.resolve(true);
				
			}
		});
		
		application.when('/test',{
			GET: function (scope,request,response) {
				
				response.write('test');
				
				return Framework.Promise.resolve(true);
				
			}
		});
		
		application.handle(request,response);
		
		response.on('end',function () {
			
			try {
				
				Framework.Expect(response.content).to.be.equal('homepage');
			
				return done();
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
	it('handle with no route',function (done) {
		
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
		
		application.when('/',{
			GET: function (scope,request,response) {
				
				response.write('test');
				
				return Framework.Promise.resolve(true);
				
			}
		});
		
		application.plugin('Test',{
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
		
		application.plugin('Work',{
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
			pathname: '/test/12345'
		};
		
		application.when('/test/:id',{
			GET: function (scope,request,response) {
				
				response.write('test');
				
				return Framework.Promise.resolve(true);
				
			}
		});
		
		application.handle(request,response);
		
		response.on('end',function () {
			
			try {
				
				Framework.Expect(request.query).to.be.eql({
					id: '12345'
				});
				
				Framework.Expect(response.content).to.be.equal('test');
			
				return done();
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
	it('constructor',function () {
		
		var application = new Framework.Application({
				modules: {
					foo: new Framework.Module(),
					bar: function () {
						return new Framework.Module();
					}
				},
				plugins: {
					foo: {},
					bar: {}
				}
			});
		
		Framework.Expect(application.modules.bar instanceof Framework.Module).to.be.equal(true);
		Framework.Expect(application.modules.foo instanceof Framework.Module).to.be.equal(true);
		
		Framework.Expect(application.plugins.bar).to.be.eql({});
		Framework.Expect(application.plugins.foo).to.be.eql({});
		
	});
	
	it('plugin as function',function () {
		
		var application = new Framework.Application(),
			plugin = {};
		
		application.plugin('bar',function () { return plugin; });
		
		Framework.Expect(application.plugins.bar).to.be.eql({});
		
	});
	
	it('service as function',function () {
		
		var application = new Framework.Application(),
			service = {};
		
		application.service('bar',function () { return service; });
		
		Framework.Expect(application.service('bar')).to.be.eql({});
		
	});
	
	it('bootstrap',function (done) {
		
		var application = new Framework.Application({
				modules: {
					foo: new Framework.Module(),
					bar: new Framework.Module()
				}
			}),
			mock = new Framework.Mock();
		
		mock.mock(application.modules.foo,'foo','bootstrap').return(true);
		mock.mock(application.modules.bar,'bar','bootstrap').return(true);
		
		application.bootstrap();
		
		mock.done(done);
		
	});
	
	it('evented with route',function (done) {
		
		var application = new Framework.Application(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		application.when('/',{
			GET: function (scope,request,response) {
				
				response.write('homepage');
				
				return Framework.Promise.resolve(true);
				
			}
		});
		
		application.evented(request,response);
		
		response.on('end',function () {
			
			try {
				
				Framework.Expect(response.content).to.be.equal('homepage');
			
				return done();
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
	it('evented with no route',function (done) {
		
		var application = new Framework.Application(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response();
		
		application.evented(request,response);
		
		response.on('end',function () {
			
			try {
				
				Framework.Expect(response.content).to.be.equal('');
			
				return done();
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
	it('evented with beforeRoute exception',function (done) {
		
		var application = new Framework.Application(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response(),
			mock = new Framework.Mock();
		
		mock.mock(application,'application','beforeRoute').reject(false);
		
		application.evented(request,response);
		
		response.on('end',function () {
			
			try {
				
				Framework.Expect(response.content).to.be.equal('false');
			
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
	it('evented with route exception',function (done) {
		
		var application = new Framework.Application(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response(),
			mock = new Framework.Mock();
		
		mock.mock(application,'application','match').reject(false);
		
		application.evented(request,response);
		
		response.on('end',function () {
			
			try {
				
				Framework.Expect(response.content).to.be.equal('false');
			
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
	it('evented with beforeController exception',function (done) {
		
		var application = new Framework.Application(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response(),
			mock = new Framework.Mock();
		
		application.when('/',{
			GET: function (scope,request,response) {
				
				response.write('homepage');
				
				return Framework.Promise.resolve(true);
				
			}
		});
		
		mock.mock(application,'application','beforeController').reject(false);
		
		application.evented(request,response);
		
		response.on('end',function () {
			
			try {
				
				Framework.Expect(response.content).to.be.equal('false');
			
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
	it('evented with controller exception',function (done) {
		
		var application = new Framework.Application(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response(),
			mock = new Framework.Mock();
		
		application.when('/',{
			GET: function (scope,request,response) {
				
				response.write('homepage');
				
				return Framework.Promise.reject(false);
				
			}
		});
		
		application.evented(request,response);
		
		response.on('end',function () {
			
			try {
				
				Framework.Expect(response.content).to.be.equal('homepagefalse');
			
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
	it('evented with afterController exception',function (done) {
		
		var application = new Framework.Application(),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response(),
			mock = new Framework.Mock();
		
		application.when('/',{
			GET: function (scope,request,response) {
				
				response.write('homepage');
				
				return Framework.Promise.resolve(true);
				
			}
		});
		
		mock.mock(application,'application','afterController').reject(false);
		
		application.evented(request,response);
		
		response.on('end',function () {
			
			try {
				
				Framework.Expect(response.content).to.be.equal('homepagefalse');
			
				return done();
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
});