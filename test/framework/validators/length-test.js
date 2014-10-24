var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Validators.Length',function () {
	
	it('allows',function (done) {
		
		var validator = new Framework.Validators.Length({
			max: 5,
			min: 3
		});
		
		validator.validate('abcde',{},{}).then(function () {
			
			done();
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('rejected'));
			
		});
		
	});
	
	it('allows with number',function (done) {
		
		var validator = new Framework.Validators.Length({
			max: 5,
			min: 3
		});
		
		validator.validate(5555,{},{}).then(function () {
			
			done();
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('rejected'));
			
		});
		
	});
	
	it('allows with object',function (done) {
		
		var validator = new Framework.Validators.Length({
			max: 5,
			min: 3
		});
		
		validator.validate({},{},{}).then(function () {
			
			done();
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('rejected'));
			
		});
		
	});
	
	it('rejects to long',function (done) {
		
		var validator = new Framework.Validators.Length({
			max: 5,
			min: 3
		});
		
		validator.validate('abcdefg0123456789',{},{}).then(function () {
			
			done(new Error('rejected'));
			
		}).catch(function (exception) {
			
			try {
				
				Framework.Expect(exception).to.be.equal('Too Long (5 Characters)');
				
				done();
			
			} catch (error) {
				
				done(error);
				
			}
			
		});
		
	});
	
	it('rejects to long',function (done) {
		
		var validator = new Framework.Validators.Length({
			max: 5,
			min: 5
		});
		
		validator.validate('abc',{},{}).then(function () {
			
			done(new Error('rejected'));
			
		}).catch(function (exception) {
			
			try {
				
				Framework.Expect(exception).to.be.equal('Too Short (5 Characters)');
				
				done();
			
			} catch (error) {
				
				done(error);
				
			}
			
		});
		
	});
		
});