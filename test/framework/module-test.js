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
	
	it('bootstrap',function (done) {
		
		var application = new Framework.Application(),
			module = new Framework.Module({
				resources: {
					blog: new Framework.Resource()
				}
			}),
			mock = new Framework.Mock();
		
		Framework.Expect(module.resource('blog') instanceof Framework.Resource).to.be.equal(true);
		
		mock.mock(module.resources.blog,'blog','bootstrap').return(true);
		
		module.bootstrap(application);
		
		mock.done(done);
		
	});
	
});