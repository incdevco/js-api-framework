var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Exception',function () {
	
	it('correct statusCode and content',function () {
		
		var exception = new Framework.Exception();
		
		Framework.Expect(exception.statusCode).to.be.equal(500);
		
		Framework.Expect(exception.content).to.be.equal('Exception Occurred');
		
	});
	
});