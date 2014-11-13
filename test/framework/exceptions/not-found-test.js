var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Exceptions.NotFound',function () {
	
	it('constructor',function () {
		
		var exception = new Framework.Exceptions.NotFound();
		
		Framework.Expect(exception.name).to.be.equal('NotFound');
		
	});
	
});