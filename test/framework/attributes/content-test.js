var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Attributes.Content',function () {
	
	it('constructor',function () {
		
		var content = new Framework.Attributes.Content();
		
		Framework.Expect(content.max).to.be.equal(60000);
		
	});
	
});