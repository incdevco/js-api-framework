var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Acl',function () {
	
	it('acl.allow',function (done) {
		
		var acl = new Framework.Acl(),
			context = {id: 'test'},
			scope = new Framework.Scope();
		
		scope.roles.push('test');
		
		acl.allow('test','test','test');
		
		acl.allow(['test'],['test'],['save']);
		
		acl.isAllowed(scope,'test','test',context).then(function (result) {
			
			try {
			
				Framework.Expect(result).to.be.eql(context);
				
				return done();
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(done);
		
	});
	
	it('acl.allow without resource or privilege',function (done) {
		
		var acl = new Framework.Acl(),
			context = {id: 'test'},
			scope = new Framework.Scope();
		
		scope.roles.push('test');
		
		acl.addResource('test');
		
		acl.allow('test');
		
		acl.isAllowed(scope,'test','test',context).then(function (result) {
			
			try {
			
				Framework.Expect(result).to.be.eql(context);
				
				return done();
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception,exception.stack);
			
			return done(exception);
			
		});
		
	});
	
	it('acl.isAllowed rejects without resource',function (done) {
		
		var acl = new Framework.Acl(),
			context = {id: 'test'},
			scope = new Framework.Scope();
		
		scope.roles.push('test');
		
		acl.allow('test');
		
		acl.isAllowed(scope,'test','test',context).then(function (result) {
			
			return done(new Error('resolved'));
			
		}).catch(function (exception) {
			
			try {
			
				Framework.Expect(exception).to.be.equal(false);
				
				return done();
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
	it('acl.isAllowed rejects',function (done) {
		
		var acl = new Framework.Acl(),
			context = {id: 'test'},
			scope = new Framework.Scope();
		
		acl.allow('test','test');
		
		acl.isAllowed(scope,'test','test',context).then(function (result) {
			
			return done(new Error('resolved'));
			
		}).catch(function (exception) {
			
			try {
			
				Framework.Expect(exception.name).to.be.equal('NotAllowed');
				
				return done();
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
	it('acl.isAllowed resolves with assertion',function (done) {
		
		var acl = new Framework.Acl(),
			context = {id: 'test'},
			scope = new Framework.Scope();
		
		scope.roles = ['test'];
		
		acl.allow('test','test','test',function (scope,resource,privilege,context) {
			
			return Framework.Promise.resolve(true);
			
		});
		
		acl.isAllowed(scope,'test','test',context).then(function (result) {
			
			return done();
			
		}).catch(done);
		
	});
	
	it('acl.isAllowed rejects with assertion',function (done) {
		
		var acl = new Framework.Acl(),
			context = {id: 'test'},
			scope = new Framework.Scope();
		
		scope.roles = ['test'];
		
		acl.allow('test','test','test',function (scope,resource,privilege,context) {
			
			return Framework.Promise.reject(false);
			
		});
		
		acl.isAllowed(scope,'test','test',context).then(function (result) {
			
			return done(new Error('resolved'));
			
		}).catch(function (exception) {
			
			return done();
			
		});
		
	});
	
	it('acl.isAllowed resolves without roles',function (done) {
		
		var acl = new Framework.Acl(),
			context = {id: 'test'},
			scope = new Framework.Scope();
		
		scope.roles = ['test'];
		
		acl.allow([],'test','test',function (scope,resource,privilege,context) {
			
			return Framework.Promise.reject(false);
			
		});
		
		acl.isAllowed(scope,'test','test',context).then(function (result) {
			
			return done(new Error('resolved'));
			
		}).catch(function (exception) {
			
			return done();
			
		});
		
	});
	
	it('acl.isAllowed resolves with multiple roles',function (done) {
		
		var acl = new Framework.Acl(),
			context = {id: 'test'},
			scope = new Framework.Scope();
		
		scope.roles = ['cat','dog'];
		
		acl.allow(['test','dog'],'test','test',function (scope,resource,privilege,context) {
			
			return Framework.Promise.reject(false);
			
		});
		
		acl.isAllowed(scope,'test','test',context).then(function (result) {
			
			return done(new Error('resolved'));
			
		}).catch(function (exception) {
			
			return done();
			
		});
		
	});
	
	it('addResource',function () {
		
		var acl = new Framework.Acl();
		
		acl.addResource('test');
		
		acl.addResource('test');
		
		Framework.Expect(acl.rules['test']).to.be.eql([]);
		
	});
	
});