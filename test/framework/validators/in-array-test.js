var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Validators.InArray',function () {
	
	it('construct with array',function () {
		
		var validator = new Framework.Validators.InArray(['test','dog']);
		
		Framework.Expect(validator.array).to.be.eql(['test','dog']);
		
	});
	
	it('allows',function (done) {
		
		var validator = new Framework.Validators.InArray({
			array: [
				'test',
				'dog',
				'fred'
			]
		});
		
		validator.validate({},'dog',{}).then(function () {
			
			done();
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('rejected'));
			
		});
		
	});
	
	it('rejects',function (done) {
		
		var validator = new Framework.Validators.InArray({
			array: [
				'test',
				'dog',
				'fred'
			]
		});
		
		validator.validate({},'abc',{}).then(function () {
			
			done(new Error('rejected'));
			
		}).catch(function (exception) {
			
			try {
				
				Framework.Expect(exception).to.be.equal('Value Not Allowed');
				
				done();
			
			} catch (error) {
				
				done(error);
				
			}
			
		});
		
	});
	
});