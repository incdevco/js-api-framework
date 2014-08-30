var base = process.env.PWD;

var expect = require('expect.js');

var Framework = require(base+'/framework');

describe('Framework.Acl',function () {
	
	it('isAllowed returns a promise and rejects if not allowed',function (done) {
		
		var acl = new Framework.Acl();
		
		var result = acl.isAllowed('Test','Test',{});
		
		result.catch(function () {
			
			done();
			
		});
		
	});
	
	it('allowed',function (done) {
		
		var acl = new Framework.Acl();
		
		acl.allow('Role','Resource','Privilege');
		
		acl.isAllowed('Resource','Privilege',{
			roles: ['Role']
		}).then(function () {
			
			done();
			
		}).catch(function (exception) {
			
			done(exception);
			
		});
		
	});
	
	it('denied',function (done) {
		
		var acl = new Framework.Acl();
		
		acl.allow('Role','Resource','Test');
		acl.allow('Developer','Resource','Privilege');
		acl.allow('Administrator');
		
		acl.isAllowed('Resource','Privilege',{
			roles: 'Role'
		}).then(function () {
			
			done(new Error('acl.isAllowed resolved'));
			
		}).catch(function (exception) {
			
			done();
			
		});
		
	});
	
	it('* rule',function (done) {
		
		var acl = new Framework.Acl(),scope = new Framework.Scope();
		
		scope.roles = ['Administrator'];
		
		acl.allow('Administrator');
		
		acl.isAllowed({
			getResourceId: function () {
				
				return 'Resource';
				
			}
		},'Privilege',scope).then(function () {
			
			done();
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('acl.isAllowed rejected'));
			
		});
		
	});
	
	it('assertion',function (done) {
		
		var acl = new Framework.Acl(),
			assertion = {
				assert: function (resource,privilege,scope) {
					
					return Framework.Promise.resolve(true);
					
				}
			},
			scope = new Framework.Scope();
		
		scope.roles = ['test'];
		
		acl.allow('test','test','test',assertion);
		
		acl.isAllowed('test','test',scope).then(function () {
			
			done();
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('acl.isAllowed rejected'));
			
		});
		
	});
	
	it('assertion failed',function (done) {
		
		var acl = new Framework.Acl(),
			assertion = {
				assert: function (resource,privilege,scope) {
					
					return Framework.Promise.reject(true);
					
				}
			},
			scope = new Framework.Scope();
		
		scope.roles = ['test'];
		
		acl.allow('test','test','test',assertion);
		
		acl.isAllowed('test','test',scope).then(function () {
			
			done(new Error('acl.isAllowed resolved'));
			
		}).catch(function (exception) {
			
			done();
			
		});
		
	});
	
	it('isAllowed with array',function (done) {
		
		var acl = new Framework.Acl();
		
		acl.isAllowed([],'test',{}).then(function () {
			
			done(new Error('acl.isAllowed resolved'));
			
		}).catch(function (exception) {
			
			try {
			
				expect(exception).to.be.equal('Resource could not be converted to a string.');
			
				done();
				
			} catch (exception) {
				
				done(exception);
				
			}
			
		});
		
	});
	
	it('rule with no roles',function (done) {
		
		var acl = new Framework.Acl();
		
		acl.allow(undefined,'Resource','Privilege');
		
		acl.isAllowed('Resource','Privilege',{
			roles: ['Role']
		}).then(function () {
			
			done();
			
		}).catch(function (exception) {
			
			done(exception);
			
		});
		
	});
	
});