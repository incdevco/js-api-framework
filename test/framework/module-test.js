var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Module',function () {
	
	it('constructor',function () {
		
		var module = new Framework.Module({
			resources: {
				blog: new Framework.Resource()
			}
		});
		
		Framework.Expect(module.resource('blog') instanceof Framework.Resource).to.be.equal(true);
		
	});
	
	it('_bootstrap',function (done) {
		
		var application = new Framework.Application(),
			post = new Framework.Resource(),
			module = new Framework.Module({
				resources: {
					blog: function () { return new Framework.Resource(); },
					post: post
				}
			}),
			mock = new Framework.Mock();
		
		post.bootstrap = 'test';
		
		Framework.Expect(module.resource('blog') instanceof Framework.Resource).to.be.equal(true);
		
		mock.mock(module.resources.blog,'blog','bootstrap')
			.return(true);
		
		module._bootstrap(application);
		
		mock.done(done);
		
	});
	
});