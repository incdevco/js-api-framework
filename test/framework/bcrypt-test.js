var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Bcrypt',function () {
	
	it('compare should return promise and resolve when password and hash match',function (done) {
		
		var password = 'test';
		
		Framework.Bcrypt.hash(password)
			.then(function (hash) {
				
				return Framework.Bcrypt.compare(password,hash);
				
			})
			.then(function (result) {
				
				Framework.Expect(result).to.be.true;
				
				done();
				
			})
			.catch(function (exception) {
				
				console.error(exception);
				
				done(exception);
				
			});
		
	});
	
	it('compare should return promise and reject when password and hash don\'t match',function (done) {
		
		var password = 'test';
		
		Framework.Bcrypt.hash(password)
			.then(function (hash) {
				
				return Framework.Bcrypt.compare('password',hash);
				
			})
			.then(function (result) {
				
				done(new Error('resolved'));
				
			})
			.catch(function (exception) {
				
				Framework.Expect(exception.message).to.be.equal('No Match');
				
				done();
				
			});
		
	});
	
});