var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Resource',function () {
	
	it('constructor',function () {
		
		var controller = function () {},
			resource = new Framework.Resource({
				controllers: {
					blog: controller
				},
				primary: 'id',
				routes: {
					blog: [
						'blog'
					]
				},
				service: 'test'
			});
		
		Framework.Expect(resource.controller('blog')).to.be.equal(controller);
		Framework.Expect(resource.primary).to.be.eql(['id']);
		Framework.Expect(resource.route('blog')).to.be.eql(['blog']);
		Framework.Expect(resource.service()).to.be.eql('test');
		
		controller = function () {},
			resource = new Framework.Resource({
				controllers: {
					blog: controller
				},
				primary: ['id'],
				routes: {
					blog: [
						'blog'
					]
				},
				service: 'test'
			});
		
		Framework.Expect(resource.controller('blog')).to.be.equal(controller);
		Framework.Expect(resource.primary).to.be.eql(['id']);
		Framework.Expect(resource.route('blog')).to.be.eql(['blog']);
		Framework.Expect(resource.service()).to.be.eql('test');
		
	});
	
	it('_bootstrap',function (done) {
		
		var application = new Framework.Application(),
			controller = function (scope,request,response) {},
			resource = new Framework.Resource({
				attributes: {
					blog: new Framework.Attribute()
				},
				controllers: {
					GET: controller
				},
				forms: {
					blog: new Framework.Form()
				},
				routes: {
					blog: [
						'GET'
					],
					'blog-post': {
						'GET': 'GET',
						'GETALL': 'GETALL',
						'POST': Framework.Controllers.POST
					}
				},
				service: 'test'
			}),
			mock = new Framework.Mock();
		
		mock.mock(application,'application','when')
			.with('blog',{
				GET: controller
			})
			.return(application);
		
		mock.mock(application,'application','when')
			.return(application);
		
		resource._bootstrap(application);
		
		mock.done(done);
		
	});
	
});