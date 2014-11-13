var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Validators.Url',function () {
	
	it('allows',function (done) {
		
		var validator = new Framework.Validators.Url();
		
		validator.validate({},'http://google.com',{}).then(function () {
			
			done();
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('rejected'));
			
		});
		
	});
	
	it('rejects',function (done) {
		
		var validator = new Framework.Validators.Url();
		
		validator.validate('abcdefg',{},{}).then(function () {
			
			done(new Error('rejected'));
			
		}).catch(function (exception) {
			
			try {
				
				Framework.Expect(exception).to.be.equal('Not A Valid Url');
				
				done();
			
			} catch (error) {
				
				done(error);
				
			}
			
		});
		
	});
	
});