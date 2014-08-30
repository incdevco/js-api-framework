var base = process.env.PWD;

var expect = require('expect.js');

var Framework = require(base+'/framework');

describe('Framework.Model',function () {
	
	it('model.delete',function (done) {
		
		var deferred = new Framework.Deferred(),
			mock = new Framework.Mock(),
			model,
			service = new Framework.Service({}),
			scope = new Framework.Scope();
			
		model = new Framework.Model({
			service: service
		});
		
		mock.object(service,{
			name: 'delete',
			'return': deferred.promise
		});
		
		deferred.resolve({
			rowsAffected: 1
		});
		
		model.delete(scope).then(function (model) {
			
			try {
			
				mock.done(done);
				
			} catch (exception) {
				
				console.error(exception);
				
				done(exception);
				
			}
			
		}).catch(function (exception) {
			
			done(exception);
			
		});
		
	});
	
	it('model.save',function (done) {
		
		var acl = new Framework.Acl(),
			deferred1 = new Framework.Deferred(),
			deferred2 = new Framework.Deferred(),
			mock = new Framework.Mock(),
			model,
			service = new Framework.Service({
				acl: acl
			}),
			scope = new Framework.Scope();
			
		model = new Framework.Model({
			attributes: {
				id: new Framework.Attribute({})
			},
			service: service
		});
		
		mock.object(service,{
			name: 'save',
			'return': deferred2.promise
		});
		
		deferred1.resolve(true);
		
		deferred2.resolve(model);
		
		model.save({
			id: 'id'
		},scope).then(function (model) {
			
			try {
			
				mock.done(done);
				
			} catch (exception) {
				
				console.error(exception);
				
				done(exception);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('model.save rejected'));
			
		});
		
	});
	
	it('model.set',function (done) {
		
		var acl = new Framework.Acl(),
			mock = new Framework.Mock(),
			model,
			service = new Framework.Service({
				acl: acl
			}),
			scope = new Framework.Scope();
			
		model = new Framework.Model({
			attributes: {
				id: new Framework.Attribute({})
			},
			data: {
				id: 'id'
			},
			service: service
		});
		
		model.set('id','test',scope);
		
		try {
			
			expect(model._modified['id']).to.be.equal('test');
			
			mock.done(done);
			
		} catch (exception) {
			
			console.error(exception);
			
			done(exception);
			
		}
		
	});
	
	it('model.toData',function (done) {
		
		var acl = new Framework.Acl(),
			deferred = new Framework.Deferred(),
			mock = new Framework.Mock(),
			model,
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl
			});
		
		model = new Framework.Model({
			attributes: {
				'id': new Framework.Attribute({
					'default': 'test'
				}),
				'name': new Framework.Attribute({
					'default': 'test'
				})
			},
			'new': true,
			service: service
		});
		
		deferred.resolve(true);
		
		mock.object(acl,{
			expects: 2,
			name: 'isAllowed',
			'return': deferred.promise
		});
		
		model.toData({}).then(function (data) {
			
			try {
			
				expect(data).to.be.eql({
					id: 'test',
					name: 'test'
				});
				
				mock.done(done);
				
			} catch (exception) {
				
				done(exception);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('model.toData rejected'));
			
		});
		
	});
	
	it('model.toJson',function (done) {
		
		var acl = new Framework.Acl(),
			deferred = new Framework.Deferred(),
			mock = new Framework.Mock(),
			model,
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl
			});
		
		model = new Framework.Model({
			attributes: {
				'id': new Framework.Attribute({
					'default': 'test'
				}),
				'name': new Framework.Attribute({
					'default': 'test'
				})
			},
			'new': true,
			service: service
		});
		
		deferred.resolve(true);
		
		mock.object(acl,{
			expects: 2,
			name: 'isAllowed',
			'return': deferred.promise
		});
		
		model.toJson({}).then(function (string) {
			
			try {
			
				expect(string).to.be.equal('{"id":"test","name":"test"}');
				
				mock.done(done);
				
			} catch (exception) {
				
				done(exception);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('model.toJson rejected'));
			
		});
		
	});
	
	it('model.getResourceId',function () {
		
		var model = new Framework.Model({
			resourceId: 'resource'
		});
		
		expect(model.getResourceId()).to.be.equal('resource');
		
	});
	
});