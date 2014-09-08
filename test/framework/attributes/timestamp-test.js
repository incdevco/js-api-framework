var base = process.env.PWD;

var expect = require('expect.js');

var Framework = require(base+'/framework');

describe('Attributes.Timestamp',function () {
	
	it('has float validator',function () {
		
		var attributes = new Framework.Attributes.Timestamp();
		
		expect(attributes.validators).to.be.eql([{
			message: 'Not Valid Float',
			regex: {}
		},{
			max: 20,
			min: undefined
		}]);
		
	});
	
	it('sets validators from config',function () {
		
		var attributes = new Framework.Attributes.Timestamp({
			validators: []
		});
		
		expect(attributes.validators).to.be.eql([{
			max: 20,
			min: undefined
		}]);
		
	});
	
});