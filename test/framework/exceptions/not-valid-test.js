var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Exceptions.NotValid',function () {
	
	it('constructor',function () {
		
		var exception = new Framework.Exceptions.NotValid();
		
		Framework.Expect(exception.name).to.be.equal('NotValid');
		
	});
	
});