var base = process.env.PWD;

var Framework = require(+'/framework');

describe('Framework.Deferred',function () {
	
	it('deferred resolves',function (done) {
		
		var deferred = new Framework.Deferred(), resolve = 'test';
		
		deferred.resolve(resolve);
		
		deferred.promise.then(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.equal(resolve);
				
				return done();
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(done);
		
	});
	
	it('deferred rejects',function (done) {
		
		var deferred = new Framework.Deferred(), reject = 'test';
		
		deferred.reject(reject);
		
		deferred.promise.then(done).catch(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.equal(reject);
				
				return done();
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
});