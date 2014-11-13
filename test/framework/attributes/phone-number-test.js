var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Attributes.PhoneNumber',function () {
	
	it('constructor',function () {
		
		var attribute = new Framework.Attributes.PhoneNumber();
		
		Framework.Expect(attribute.max).to.be.equal(30);
		Framework.Expect(attribute.validators[0] instanceof Framework.Validators.PhoneNumber).to.be.equal(true);
		
	});
	
	it('constructor with validators',function () {
		
		var attribute = new Framework.Attributes.PhoneNumber({
			validators: []
		});
		
		Framework.Expect(attribute.max).to.be.equal(30);
		Framework.Expect(attribute.validators.length).to.be.equal(1);
		
	});
	
});