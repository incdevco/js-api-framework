var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Plugins.HealthCheck',function () {
	
	it('adds route to application',function (done) {
		
		var application = new Framework.Application({}),
			mock = new Framework.Mock();
		
		mock.object(application,{
			expects: 1,
			name: 'when',
			return: 'test'
		});
		
		Framework.Plugins.HealthCheck.bootstrap(application);
		
		mock.done(done);
		
	});
	
});