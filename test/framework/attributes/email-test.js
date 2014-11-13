var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Attributes.Email',function () {
	
	it('constructor',function () {
		
		var attribute = new Framework.Attributes.Email();
		
		Framework.Expect(attribute.max).to.be.equal(250);
		Framework.Expect(attribute.validators[0] instanceof Framework.Validators.Email).to.be.true;
		
	});
	
	it('constructor with validators',function () {
		
		var attribute = new Framework.Attributes.Email({
			validators: []
		});
		
		Framework.Expect(attribute.max).to.be.equal(250);
		Framework.Expect(attribute.validators[0] instanceof Framework.Validators.Length).to.be.true;
		
	});
	
});