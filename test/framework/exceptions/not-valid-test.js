var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Exceptions.NotValid',function () {
	
	it('constructor',function () {
		
		var exception = new Framework.Exceptions.NotValid();
		
		Framework.Expect(exception.statusCode).to.be.equal(400);
		Framework.Expect(exception.content).to.be.equal('Not Valid');
		
	});
	
	it('constructor without privilege and resource',function () {
		
		var exception = new Framework.Exceptions.NotValid({
			content: {test: 'test'}
		});
		
		Framework.Expect(exception.statusCode).to.be.equal(400);
		Framework.Expect(exception.content).to.be.equal('{"test":"test"}');
		
	});
	
});