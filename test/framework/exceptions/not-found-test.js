var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Exceptions.NotFound',function () {
	
	it('constructor',function () {
		
		var exception = new Framework.Exceptions.NotFound();
		
		Framework.Expect(exception.statusCode).to.be.equal(404);
		Framework.Expect(exception.content).to.be.equal('Not Found');
		
	});
	
});