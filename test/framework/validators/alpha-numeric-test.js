var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Validators.Alphanumeric',function () {
	
	it('allows a-z and 0-9',function (done) {
		
		var validator = new Framework.Validators.Alphanumeric();
		
		validator.validate('abcdefghijklmnopqrstuvwxyz0123456789',{},{}).then(function () {
			
			done();
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('rejected'));
			
		});
		
	});
	
	it('rejects -*&^%$',function (done) {
		
		var validator = new Framework.Validators.Alphanumeric();
		
		validator.validate('abcdefg01&*^@23456789',{},{}).then(function () {
			
			done(new Error('rejected'));
			
		}).catch(function (exception) {
			
			try {
				
				Framework.Expect(exception).to.be.equal('Only Alphanumeric Characters Allowed (abcdefg01&*^@23456789)');
				
				done();
			
			} catch (error) {
				
				done(error);
				
			}
			
		});
		
	});
	
});