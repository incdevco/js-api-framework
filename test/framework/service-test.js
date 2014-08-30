var base = process.env.PWD;

var expect = require('expect.js');

var Framework = require(base+'/framework');

describe('Framework.Service',function () {
	
	it('service.add',function (done) {
		
		var acl = new Framework.Acl(),
			adapter = new Framework.MysqlAdapter({}),
			deferred = new Framework.Deferred(),
			mock = new Framework.Mock(),
			model = new Framework.Model({}),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: adapter
			});
		
		mock.object(adapter,{
			expects: 1,
			name: 'insert',
			'return': deferred.promise
		});
		
		deferred.resolve({
			affectedRows: 1
		});
		
		service.add(model,scope).then(function (result) {
			
			try {
			
				expect(result).to.be.ok();
				
				mock.done(done);
				
			} catch (exception) {
				
				done(exception);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('service.add rejected'));
			
		});
		
	});
	
	it('service.add rejects',function (done) {
		
		var acl = new Framework.Acl(),
			adapter = new Framework.MysqlAdapter({}),
			deferred = new Framework.Deferred(),
			mock = new Framework.Mock(),
			model = new Framework.Model({}),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: adapter
			});
		
		mock.object(adapter,{
			expects: 1,
			name: 'insert',
			'return': deferred.promise
		});
		
		deferred.resolve({
			affectedRows: 0
		});
		
		service.add(model,scope).then(function (result) {
			
			done(new Error('service.add resolved'));
			
		}).catch(function (exception) {
			
			mock.done(done);
			
		});
		
	});
	
	it('service.createId',function () {
		
		var service = new Framework.Service({idLength:5});
		
		expect(service.createId().length).to.be.equal(5);
		
	});
	
	it('service.delete',function (done) {
		
		var acl = new Framework.Acl(),
			adapter = new Framework.MysqlAdapter({}),
			deferred = new Framework.Deferred(),
			mock = new Framework.Mock(),
			model = new Framework.Model({}),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: adapter
			});
		
		mock.object(acl,{
			expects: 1,
			name: 'isAllowed',
			'return': deferred.promise
		});
		
		mock.object(adapter,{
			expects: 1,
			name: 'delete',
			'return': deferred.promise
		});
		
		deferred.resolve({
			affectedRows: 1
		});
		
		service.delete(model,scope).then(function (result) {
			
			try {
			
				expect(result).to.be.ok();
				
				mock.done(done);
				
			} catch (exception) {
				
				done(exception);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('service.deleted rejected'));
			
		});
		
	});
	
	it('service.delete rejects',function (done) {
		
		var acl = new Framework.Acl(),
			adapter = new Framework.MysqlAdapter({}),
			deferred = new Framework.Deferred(),
			mock = new Framework.Mock(),
			model = new Framework.Model({}),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: adapter
			});
		
		mock.object(acl,{
			expects: 1,
			name: 'isAllowed',
			'return': deferred.promise
		});
		
		mock.object(adapter,{
			expects: 1,
			name: 'delete',
			'return': deferred.promise
		});
		
		deferred.resolve({
			affectedRows: 0
		});
		
		service.delete(model,scope).then(function (result) {
			
			done(new Error('service.delete resolved'));
			
		}).catch(function (exception) {
			
			mock.done(done);
			
		});
		
	});
	
	it('service.edit',function (done) {
		
		var acl = new Framework.Acl(),
			adapter = new Framework.MysqlAdapter({}),
			deferred = new Framework.Deferred(),
			mock = new Framework.Mock(),
			model = new Framework.Model({}),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: adapter
			});
		
		mock.object(adapter,{
			expects: 1,
			name: 'update',
			'return': deferred.promise
		});
		
		deferred.resolve({
			affectedRows: 1
		});
		
		service.edit(model,scope).then(function (result) {
			
			try {
			
				expect(result).to.be.ok();
				
				mock.done(done);
				
			} catch (exception) {
				
				done(exception);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('service.deleted rejected'));
			
		});
		
	});
	
	it('service.edit rejects',function (done) {
		
		var acl = new Framework.Acl(),
			adapter = new Framework.MysqlAdapter({}),
			deferred = new Framework.Deferred(),
			mock = new Framework.Mock(),
			model = new Framework.Model({}),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: adapter
			});
		
		mock.object(adapter,{
			expects: 1,
			name: 'update',
			'return': deferred.promise
		});
		
		deferred.resolve({
			affectedRows: 0
		});
		
		service.edit(model,scope).then(function (result) {
			
			done(new Error('service.edit resolved'));
			
		}).catch(function (exception) {
			
			mock.done(done);
			
		});
		
	});
	
	it('service.fetchAll',function (done) {
		
		var acl = new Framework.Acl(),
			adapter = new Framework.MysqlAdapter({}),
			deferred1 = new Framework.Deferred(),
			deferred2 = new Framework.Deferred(),
			mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: adapter,
				model: Framework.Model
			}),
			model = new Framework.Model({
				service: service
			});
		
		mock.object(acl,{
			expects: 2,
			name: 'isAllowed',
			'return': deferred1.promise
		});
		
		mock.object(adapter,{
			expects: 1,
			name: 'fetchAll',
			'return': deferred2.promise
		});
		
		deferred1.resolve(model);
		
		deferred2.resolve([
			{},
			{}
		]);
		
		service.fetchAll(undefined,undefined,undefined,scope).then(function (result) {
			
			result.toJson(scope).then(function (string) {
				
				try {
				
					expect(string).to.be.equal('[{},{}]');
					
					mock.done(done);
					
				} catch (exception) {
					
					done(exception);
					
				}
				
			});
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('service.deleted rejected'));
			
		});
		
	});
	
	it('service.fetchAll with form',function (done) {
		
		var acl = new Framework.Acl(),
			adapter = new Framework.MysqlAdapter({}),
			deferred1 = new Framework.Deferred(),
			deferred2 = new Framework.Deferred(),
			deferred3 = new Framework.Deferred(),
			form = new Framework.Form({}),
			mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: adapter,
				forms: {
					fetchAll: form
				},
				model: Framework.Model
			}),
			model = new Framework.Model({
				service: service
			});
		
		mock.object(acl,{
			expects: 2,
			name: 'isAllowed',
			'return': deferred1.promise
		});
		
		mock.object(adapter,{
			expects: 1,
			name: 'fetchAll',
			'return': deferred2.promise
		});
		
		mock.object(form,{
			expects: 1,
			name: 'validate',
			'return': deferred3.promise
		});
		
		deferred1.resolve(model);
		
		deferred2.resolve([
			{},
			{}
		]);
		
		deferred3.resolve({});
		
		service.fetchAll(undefined,undefined,undefined,scope).then(function (result) {
			
			result.toJson(scope).then(function (string) {
				
				try {
				
					expect(string).to.be.equal('[{},{}]');
					
					mock.done(done);
					
				} catch (exception) {
					
					done(exception);
					
				}
				
			});
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('service.deleted rejected'));
			
		});
		
	});
	
	it('service.fetchNew',function (done) {
		
		var adapter = new Framework.MysqlAdapter({}),
			service = new Framework.Service({
				model: Framework.Model
			});
		
		service.fetchNew().then(function (result) {
			
			result.toJson({}).then(function (string) {
				
				try {
				
					expect(string).to.be.equal('{}');
					
					done();
					
				} catch (exception) {
					
					done(exception);
					
				}
				
			});
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('service.fetchNew rejected'));
			
		});
		
	});
	
	it('service.fetchOne',function (done) {
		
		var acl = new Framework.Acl(),
			adapter = new Framework.MysqlAdapter({}),
			deferred1 = new Framework.Deferred(),
			deferred2 = new Framework.Deferred(),
			mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: adapter,
				model: Framework.Model
			}),
			model = new Framework.Model({
				service: service
			});
		
		mock.object(acl,{
			expects: 1,
			name: 'isAllowed',
			'return': deferred1.promise
		});
		
		mock.object(adapter,{
			expects: 1,
			name: 'fetchRow',
			'return': deferred2.promise
		});
		
		deferred1.resolve(model);
		
		deferred2.resolve({});
		
		service.fetchOne(undefined,scope).then(function (result) {
			
			result.toJson(scope).then(function (string) {
				
				try {
				
					expect(string).to.be.equal('{}');
					
					mock.done(done);
					
				} catch (exception) {
					
					done(exception);
					
				}
				
			});
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('service.fetchOne rejected'));
			
		});
		
	});
	
	it('service.fetchOne rejects',function (done) {
		
		var acl = new Framework.Acl(),
			adapter = new Framework.MysqlAdapter({}),
			deferred1 = new Framework.Deferred(),
			deferred2 = new Framework.Deferred(),
			mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: adapter,
				model: Framework.Model
			});
		
		mock.object(adapter,{
			expects: 1,
			name: 'fetchRow',
			'return': deferred2.promise
		});
		
		deferred1.resolve(true);
		
		deferred2.resolve(null);
		
		service.fetchOne(undefined,scope).then(function (result) {
			
			done(new Error('service.fetchOne resolved'));
			
		}).catch(function (exception) {
			
			mock.done(done);
			
		});
		
	});
	
	it('service.fetchOne with form',function (done) {
		
		var acl = new Framework.Acl(),
			adapter = new Framework.MysqlAdapter({}),
			deferred1 = new Framework.Deferred(),
			deferred2 = new Framework.Deferred(),
			deferred3 = new Framework.Deferred(),
			form = new Framework.Form({}),
			mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: adapter,
				forms: {
					fetchOne: form
				},
				model: Framework.Model
			}),
			model = new Framework.Model({
				service: service
			});
		
		mock.object(acl,{
			expects: 1,
			name: 'isAllowed',
			'return': deferred1.promise
		});
		
		mock.object(adapter,{
			expects: 1,
			name: 'fetchRow',
			'return': deferred2.promise
		});
		
		mock.object(form,{
			expects: 1,
			name: 'validate',
			'return': deferred3.promise
		});
		
		deferred1.resolve(model);
		
		deferred2.resolve({});
		
		deferred3.resolve({});
		
		service.fetchOne(undefined,scope).then(function (result) {
			
			result.toJson(scope).then(function (string) {
				
				try {
				
					expect(string).to.be.equal('{}');
					
					mock.done(done);
					
				} catch (exception) {
					
					done(exception);
					
				}
				
			});
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('service.fetchOne rejected'));
			
		});
		
	});
	
});