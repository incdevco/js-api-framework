var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Validators.PhoneNumber',function () {
	
	it('allows',function (done) {
		
		var validator = new Framework.Validators.PhoneNumber();
		
		validator.validate('0123456789',{},{}).then(function () {
			
			done();
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('rejected'));
			
		});
		
	});
	
	it('rejects -*&^%$',function (done) {
		
		var validator = new Framework.Validators.PhoneNumber();
		
		validator.validate('abcdefg01&*^@23456789',{},{}).then(function () {
			
			done(new Error('rejected'));
			
		}).catch(function (exception) {
			
			try {
				
				Framework.Expect(exception).to.be.equal('Only + and 0-9 Allowed (abcdefg01&*^@23456789)');
				
				done();
			
			} catch (error) {
				
				done(error);
				
			}
			
		});
		
	});
	
});