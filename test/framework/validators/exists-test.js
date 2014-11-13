var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Validators.Exists',function () {
	
	it('resolves',function (done) {
		
		var service = new Framework.Service(),
			validator = new Framework.Validators.Exists({
				key: 'id',
				service: 'Test'
			}),
			mock = new Framework.Mock(),
			scope = new Framework.Scope();
		
		mock.mock(service,'service','fetchOne').resolve(true);
		
		scope.service('Test',service);
		
		validator.validate(scope,'abcdefghijklmnopqrstuvwxyz',{}).then(function () {
			
			mock.done(done);
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('rejected'));
			
		});
		
	});
	
	it('rejects',function (done) {
		
		var service = new Framework.Service(),
			validator = new Framework.Validators.Exists({
				key: 'id',
				service: 'Test'
			}),
			mock = new Framework.Mock(),
			scope = new Framework.Scope();
		
		mock.mock(service,'service','fetchOne').reject(true);
		
		scope.service('Test',service);
		
		validator.validate(scope,'abcdefg0123456789',{}).then(function () {
			
			done(new Error('rejected'));
			
		}).catch(function (exception) {
			
			try {
				
				Framework.Expect(exception).to.be.equal('Does Not Exist');
				
				mock.done(done);
			
			} catch (error) {
				
				done(error);
				
			}
			
		});
		
	});
	
	it('rejects without service',function (done) {
		
		var service = new Framework.Service(),
			validator = new Framework.Validators.Exists({
				key: 'id',
				service: 'Test'
			}),
			mock = new Framework.Mock(),
			scope = new Framework.Scope();
		
		validator.validate(scope,'abcdefg0123456789',{}).then(function () {
			
			done(new Error('rejected'));
			
		}).catch(function (exception) {
			
			try {
				
				Framework.Expect(exception).to.be.equal('Does Not Exist');
				
				mock.done(done);
				
			} catch (error) {
				
				done(error);
				
			}
			
		});
		
	});
		
});