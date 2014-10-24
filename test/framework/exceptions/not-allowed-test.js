var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Exceptions.NotAllowed',function () {
	
	it('constructor',function () {
		
		var exception = new Framework.Exceptions.NotAllowed({
			resource: 'resource',
			privilege: 'privilege'
		});
		
		Framework.Expect(exception.statusCode).to.be.equal(403);
		Framework.Expect(exception.content).to.be.equal('Not allowed to privilege on resource.');
		
	});
	
	it('constructor without privilege and resource',function () {
		
		var exception = new Framework.Exceptions.NotAllowed();
		
		Framework.Expect(exception.statusCode).to.be.equal(403);
		Framework.Expect(exception.content).to.be.equal('Not Allowed');
		
	});
	
});