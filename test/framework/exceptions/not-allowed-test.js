var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Exceptions.NotAllowed',function () {
	
	it('constructor',function () {
		
		var exception = new Framework.Exceptions.NotAllowed({
			resource: 'resource',
			privilege: 'privilege'
		});
		
		Framework.Expect(exception.name).to.be.equal('NotAllowed');
		
	});
	
});