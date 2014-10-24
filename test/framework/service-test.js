var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Service',function () {
	
	it('service.delete',function (done) {
		
		var acl = new Framework.Acl(),
			mock = new Framework.Mock(),
			model = {},
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				},
				forms: {
					'delete': {}
				}
			});
		
		mock.mock(service.forms.delete,'form.delete','validate').resolve(model);
		
		mock.mock(service.acl,'acl','isAllowed').resolve(model);
		
		mock.mock(service.adapter,'adapter','delete').resolve(model);
		
		service.delete(scope,model).then(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.eql({});
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			return done(exception);
			
		});
		
	});
	
	it('service.delete without form',function (done) {
		
		var acl = new Framework.Acl(),
			mock = new Framework.Mock(),
			model = {},
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				}
			});
		
		mock.mock(service.acl,'acl','isAllowed').resolve(model);
		
		mock.mock(service.adapter,'adapter','delete').resolve(model);
		
		service.delete(scope,model).then(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.eql({});
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			return done(exception);
			
		});
		
	});
	
	it('service.fetchAll',function (done) {
		
		var acl = new Framework.Acl(),
			mock = new Framework.Mock(),
			model = {},
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				},
				forms: {
					'fetchAll': {}
				}
			});
		
		mock.mock(service.forms.fetchAll,'form.fetchAll','validate').resolve(model);
		
		mock.mock(service.acl,'acl','isAllowed').resolve(model);
		
		mock.mock(service.adapter,'adapter','fetch').resolve([model]);
		
		service.fetchAll(scope,{},1,1).then(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.eql([{}]);
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			return done(exception);
			
		});
		
	});
	
	it('service.fetchAll without form',function (done) {
		
		var acl = new Framework.Acl(),
			mock = new Framework.Mock(),
			model = {},
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				}
			});
		
		mock.mock(service.acl,'acl','isAllowed').resolve(model);
		
		mock.mock(service.adapter,'adapter','fetch').resolve([model]);
		
		service.fetchAll(scope,{}).then(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.eql([{}]);
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			return done(exception);
			
		});
		
	});
	
	it('service.fetchAll where acl rejects',function (done) {
		
		var acl = new Framework.Acl(),
			mock = new Framework.Mock(),
			model = {},
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				},
				forms: {
					'fetchAll': {}
				}
			});
		
		mock.mock(service.forms.fetchAll,'form.fetchAll','validate').resolve({});
		
		mock.mock(service.acl,'acl','isAllowed').reject(false);
		
		mock.mock(service.adapter,'adapter','fetch').resolve([model]);
		
		service.fetchAll(scope,{},1,1).then(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.eql([]);
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			return done(exception);
			
		});
		
	});
	
	it('service.fetchNew',function () {
		
		var service = new Framework.Service({
			adapter: function () {
				return new Framework.Adapters.Mysql({})
			}
		});
		
		var model = service.fetchNew();
		
		Framework.Expect(model).to.be.eql({});
		
	});
	
	it('service.fetchOne',function (done) {
		
		var acl = new Framework.Acl(),
			mock = new Framework.Mock(),
			model = {},
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				},
				forms: {
					'fetchOne': {}
				}
			});
		
		mock.mock(service.forms.fetchOne,'form.fetchOne','validate').resolve(model);
		
		mock.mock(service.acl,'acl','isAllowed').resolve(model);
		
		mock.mock(service.adapter,'adapter','fetch').resolve(model);
		
		service.fetchOne(scope,{},1).then(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.eql({});
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			return done(exception);
			
		});
		
	});
	
	it('service.fetchOne without form',function (done) {
		
		var acl = new Framework.Acl(),
			mock = new Framework.Mock(),
			model = {},
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				}
			});
		
		mock.mock(service.acl,'acl','isAllowed').resolve(model);
		
		mock.mock(service.adapter,'adapter','fetch').resolve(model);
		
		service.fetchOne(scope,{},1).then(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.eql({});
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			return done(exception);
			
		});
		
	});
	
	it('service.fetchOne acl rejects',function (done) {
		
		var acl = new Framework.Acl(),
			mock = new Framework.Mock(),
			model = {},
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				}
			});
		
		mock.mock(service.acl,'acl','isAllowed').reject(false);
		
		mock.mock(service.adapter,'adapter','fetch').resolve(model);
		
		service.fetchOne(scope,{}).then(function (result) {
			
			return done(new Error('resolved'));
			
		}).catch(function (exception) {
			
			try {
				
				Framework.Expect(exception).to.be.equal(false);
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
	it('service.form',function () {
		
		var service = new Framework.Service();
		
		form = service.form('test');
		
		Framework.Expect(form).to.be.equal(undefined);
		
	});
	
	it('service.insert',function (done) {
		
		var acl = new Framework.Acl(),
			mock = new Framework.Mock(),
			model = {},
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				},
				forms: {
					'insert': {}
				}
			});
		
		mock.mock(service.forms.insert,'form.insert','validate').resolve(model);
		
		mock.mock(service.acl,'acl','isAllowed').resolve(model);
		
		mock.mock(service.adapter,'adapter','insert').resolve(model);
		
		service.insert(scope,{}).then(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.eql({});
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			return done(exception);
			
		});
		
	});
	
	it('service.insert without form',function (done) {
		
		var acl = new Framework.Acl(),
			mock = new Framework.Mock(),
			model = {},
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				}
			});
		
		mock.mock(service.acl,'acl','isAllowed').resolve(model);
		
		mock.mock(service.acl,'acl','isAllowed').resolve(model);
		
		mock.mock(service.adapter,'adapter','insert').resolve(model);
		
		service.insert(scope,{
			test: 'test'
		}).then(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.eql({});
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			return done(exception);
			
		});
		
	});
	
	it('service.toJson with array',function (done) {
		
		var acl = new Framework.Acl(),
			mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				},
				resourceId: 'test'
			});
		
		mock.mock(service.acl,'acl','isAllowed').resolve(true);
		
		service.toJson(scope,[{
			test: 'test'
		}]).then(function (json) {
			
			try {
				
				Framework.Expect(json).to.be.equal('[{"test":"test"}]');
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(function (exception) {
			
			return done(exception);
			
		});
		
	});
	
	it('service.toJson with array rejects',function (done) {
		
		var acl = new Framework.Acl(),
			mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				},
				resourceId: 'test'
			});
		
		mock.mock(service.acl,'acl','isAllowed').reject(false);
		
		service.toJson(scope,[{
			test: 'test'
		}]).then(function (json) {
			
			try {
				
				Framework.Expect(json).to.be.equal('[{}]');
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(function (exception) {
			
			return done(exception);
			
		});
		
	});
	
	it('service.toJson',function (done) {
		
		var acl = new Framework.Acl(),
			mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				},
				resourceId: 'test'
			});
		
		mock.mock(service.acl,'acl','isAllowed').resolve(true);
		
		service.toJson(scope,{
			test: 'test'
		}).then(function (json) {
			
			try {
				
				Framework.Expect(json).to.be.equal('{"test":"test"}');
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(function (exception) {
			
			return done(exception);
			
		});
		
	});
	
	it('service.toJson acl rejects',function (done) {
		
		var acl = new Framework.Acl(),
			mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				},
				resourceId: 'test'
			});
		
		mock.mock(service.acl,'acl','isAllowed').reject(false);
		
		service.toJson(scope,{
			test: 'test'
		}).then(function (json) {
			
			try {
				
				Framework.Expect(json).to.be.equal('{}');
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(function (exception) {
			
			return done(exception);
			
		});
		
	});
	
	it('service.update',function (done) {
		
		var acl = new Framework.Acl(),
			mock = new Framework.Mock(),
			model = {},
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				},
				forms: {
					'update': {}
				}
			});
		
		mock.mock(service.forms.update,'form.update','validate').resolve({
			test: 'test'
		});
		
		mock.mock(service.acl,'acl','isAllowed').resolve({
			test: 'test'
		});
		
		mock.mock(service.acl,'acl','isAllowed').resolve({
			test: 'test'
		});
		
		mock.mock(service.adapter,'adapter','update').resolve(model);
		
		service.update(scope,{
			test: 'test'
		}).then(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.eql({});
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			return done(exception);
			
		});
		
	});
	
	it('service.update without form',function (done) {
		
		var acl = new Framework.Acl(),
			mock = new Framework.Mock(),
			model = {},
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: acl,
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				}
			});
		
		mock.mock(service.acl,'acl','isAllowed').resolve({
			test: 'test'
		});
		
		mock.mock(service.acl,'acl','isAllowed').resolve({
			test: 'test'
		});
		
		mock.mock(service.adapter,'adapter','update').resolve(model);
		
		service.update(scope,{
			test: 'test'
		}).then(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.eql({});
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			return done(exception);
			
		});
		
	});
	
});