var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Scope',function () {
	
	it('service',function () {
		
		var scope = new Framework.Scope(),
			name = 'test',
			service = {test: 'test'};
		
		scope.service(name,service);
		
		Framework.Expect(scope.service(name)).to.be.eql(service);
		
	});
	
});