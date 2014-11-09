var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Validators.Alpha',function () {
	
	it('allows a-z',function (done) {
		
		var validator = new Framework.Validators.Alpha();
		
		validator.validate({},'abcdefghijklmnopqrstuvwxyz',{}).then(function () {
			
			done();
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('rejected'));
			
		});
		
	});
	
	it('rejects 0-9',function (done) {
		
		var validator = new Framework.Validators.Alpha();
		
		validator.validate({},'abcdefg0123456789',{}).then(function () {
			
			done(new Error('rejected'));
			
		}).catch(function (exception) {
			
			try {
				
				Framework.Expect(exception).to.be.equal('Only Alpha Characters Allowed (abcdefg0123456789)');
				
				done();
			
			} catch (error) {
				
				done(error);
				
			}
			
		});
		
	});
		
});