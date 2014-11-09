var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Attributes.Money',function () {
	
	it('constructor',function () {
		
		var attribute = new Framework.Attributes.Money();
		
		Framework.Expect(attribute.max).to.be.equal(30);
		Framework.Expect(attribute.validators[0] instanceof Framework.Validators.Float).to.be.equal(true);
		
	});
	
	it('constructor with validators',function () {
		
		var attribute = new Framework.Attributes.Money({
			validators: []
		});
		
		Framework.Expect(attribute.max).to.be.equal(30);
		Framework.Expect(attribute.validators.length).to.be.equal(1);
		
	});
	
});