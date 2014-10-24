var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Resource',function () {
	
	it('constructor',function () {
		
		var controller = function () {},
			resource = new Framework.Resource({
				attributes: {
					blog: new Framework.Attribute()
				},
				controllers: {
					blog: controller
				},
				forms: {
					blog: new Framework.Form()
				},
				routes: {
					blog: [
						'blog'
					]
				},
				service: 'test'
			});
		
		Framework.Expect(resource.attribute('blog') instanceof Framework.Attribute).to.be.equal(true);
		Framework.Expect(resource.controller('blog')).to.be.equal(controller);
		Framework.Expect(resource.form('blog') instanceof Framework.Form).to.be.equal(true);
		Framework.Expect(resource.route('blog')).to.be.eql(['blog']);
		Framework.Expect(resource.service()).to.be.eql('test');
		
	});
	
	it('bootstrap',function (done) {
		
		var application = new Framework.Application(),
			controller = function () {},
			resource = new Framework.Resource({
				attributes: {
					blog: new Framework.Attribute()
				},
				controllers: {
					blog: controller
				},
				forms: {
					blog: new Framework.Form()
				},
				routes: {
					blog: [
						'blog'
					],
					'blog-post': [
						'blog'
					]
				},
				service: 'test'
			}),
			mock = new Framework.Mock();
		
		mock.mock(application,'application','when').with('blog',{
			blog: controller
		}).return(application);
		
		mock.mock(application,'application','when').return(application);
		
		resource.bootstrap(application);
		
		mock.done(done);
		
	});
	
});