var base = process.env.PWD;

var expect = require('expect.js');

var Framework = require(base+'/framework');

describe('Framework.Mock',function () {
	
	it('mock.done',function () {
		
		var error, mock = new Framework.Mock();
		
		mock.called(1);
		
		mock.function({});
		
		mock.done(function (e) {
			
			error = e;
			
		});
		
		expect(error.message).to.be.equal('function undefined was called 0 times, when expecting 1');
		
	});
	
});