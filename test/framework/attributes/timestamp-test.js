var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Attributes.Timestamp',function () {
	
	it('constructor',function () {
		
		var content = new Framework.Attributes.Timestamp();
		
		Framework.Expect(content.max).to.be.equal(20);
		
	});
	
	it('constructor with validators',function () {
		
		var content = new Framework.Attributes.Timestamp({
			validators: []
		});
		
		Framework.Expect(content.validators.length).to.be.equal(1);
		
	});
	
});