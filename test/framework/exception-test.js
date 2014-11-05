var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Exception',function () {
	
	it('correct name',function () {
		
		var exception = new Framework.Exception();
		
		Framework.Expect(exception.name).to.be.equal('Exception');
		
	});
	
});