var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Service',function () {

	it('constructor',function () {

		var service = new Framework.Service({
			forms: {
				'test': new Framework.Form()
			},
			primary: 'id'
		});

		Framework.Expect(service.forms.test instanceof Framework.Form).to.be.equal(true);
		Framework.Expect(service._primary).to.be.eql(['id']);

		service = new Framework.Service({
			primary: ['id']
		});

		Framework.Expect(service._primary).to.be.eql(['id']);

	});

	it('adapter',function () {

		var service = new Framework.Service({
			adapter: function () { return new Framework.Adapters.Mysql({}); }
		});

		Framework.Expect(service.adapter() instanceof Framework.Adapters.Mysql).to.be.equal(true);

		service = new Framework.Service({
			adapter: new Framework.Adapters.Mysql({})
		});

		Framework.Expect(service.adapter() instanceof Framework.Adapters.Mysql).to.be.equal(true);

	});

	it('add',function (done) {

		var mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				}
			});

		mock.mock(service,'service','isValid')
			.with('add',scope,{
				test: 'test'
			})
			.resolve({
				test: 'test'
			});

		mock.mock(service,'service','isAllowed')
			.with(scope,{
				test: 'test'
			},'add','set')
			.resolve({
				test: 'test'
			});

		mock.mock(service.adapter(),'adapter','add')
			.with({
				test: 'test'
			})
			.resolve({
				test: 'test'
			});

		service.add(scope,{
			test: 'test'
		}).then(function (result) {

			try {

				Framework.Expect(result).to.be.eql({
					test: 'test'
				});

				return mock.done(done);

			} catch (error) {

				return done(error);

			}

		}).catch(function (exception) {

			console.error(exception);

			return done(exception);

		});

	});

	it('add with bypass',function (done) {

		var mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				}
			});

		mock.mock(service,'service','isValid')
			.with('add',scope,{
				test: 'test'
			})
			.resolve({
				test: 'test'
			});

		mock.mock(service.adapter(),'adapter','add')
			.with({
				test: 'test'
			})
			.resolve({
				test: 'test'
			});

		service.add(scope,{
			test: 'test'
		},true).then(function (result) {

			try {

				Framework.Expect(result).to.be.eql({
					test: 'test'
				});

				return mock.done(done);

			} catch (error) {

				return done(error);

			}

		}).catch(function (exception) {

			console.error(exception);

			return done(exception);

		});

	});

	it('allowed',function (done) {

		var mock = new Framework.Mock(),
			service = new Framework.Service({
				acl: new Framework.Acl(),
				resource: 'test'
			}),
			scope = new Framework.Scope();

		mock.mock(service.acl,'acl','isAllowed')
			.with(scope,'test','get::denied')
			.reject(new Framework.Exceptions.NotAllowed());

		mock.mock(service.acl,'acl','isAllowed')
			.with(scope,'test','get::test')
			.resolve(true);

		service.allowed(scope,{
			denied: 'denied',
			test: 'test'
		},'get').then(function (result) {

			Framework.Expect(result).to.be.eql({
				test: 'test'
			});

			mock.done(done);

		}).catch(done);

	});

	it('_bootstrap',function (done) {

		var adapter = new Framework.Adapters.Mysql({}),
			mock = new Framework.Mock(),
			service = new Framework.Service();

		mock.mock(adapter,'adapter','_bootstrap')
			.return(true);

		mock.mock(adapter,'adapter','bootstrap')
			.return(true);

		service.adapter(adapter);

		service._bootstrap();

		mock.done(done);

	});

	it('_bootstrap adapter without bootstrap',function (done) {

		var adapter = new Framework.Adapters.Mysql({}),
			mock = new Framework.Mock(),
			service = new Framework.Service();

		mock.mock(adapter,'adapter','_bootstrap')
			.return(true);

		adapter.bootstrap = 'test';

		service.adapter(adapter);

		service._bootstrap();

		mock.done(done);

	});

	it('delete',function (done) {

		var mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				}
			});

		mock.mock(service,'service','fetchOne')
			.with(scope,{
				test: 'test'
			})
			.resolve({
				test: 'test'
			});

		mock.mock(service,'service','isAllowed')
			.with(scope,{
				test: 'test'
			},'delete')
			.resolve({
				test: 'test'
			});

		mock.mock(service.adapter(),'adapter','delete')
			.with({
				test: 'test'
			})
			.resolve({
				test: 'test'
			});

		service.delete(scope,{
			test: 'test'
		}).then(function (result) {

			try {

				Framework.Expect(result).to.be.eql({
					test: 'test'
				});

				return mock.done(done);

			} catch (error) {

				return done(error);

			}

		}).catch(function (exception) {

			console.error(exception);

			return done(exception);

		});

	});

	it('edit',function (done) {

		var mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				}
			});

		mock.mock(service,'service','fetchOne')
			.with(scope,{
				test: 'test'
			})
			.resolve({
				test: 'test'
			});

		mock.mock(service,'service','isValid')
			.with('edit',scope,{
				test: 'test'
			})
			.resolve({
				test: 'test'
			});

		mock.mock(service,'service','isAllowed')
			.with(scope,{
				test: 'test'
			},'edit','set')
			.resolve({
				test: 'test'
			});

		mock.mock(service.adapter(),'adapter','edit')
			.with({
				test: 'test'
			})
			.resolve({
				test: 'test'
			});

		service.edit(scope,{
			test: 'test'
		}).then(function (result) {

			try {

				Framework.Expect(result).to.be.eql({
					test: 'test'
				});

				return mock.done(done);

			} catch (error) {

				return done(error);

			}

		}).catch(function (exception) {

			console.error(exception);

			return done(exception);

		});

	});

	it('fetchAll',function (done) {

		var mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				}
			});

		mock.mock(service,'service','isValid')
			.with('fetchAll',scope,{})
			.resolve({});

		mock.mock(service.adapter(),'adapter','fetchAll')
			.with({})
			.resolve([{}]);

		mock.mock(service,'service','isAllowed')
			.with(scope,[{}],'view','get')
			.resolve({});

		service.fetchAll(scope,{})
			.then(function (result) {

				try {

					Framework.Expect(result).to.be.eql({});

					return mock.done(done);

				} catch (error) {

					return done(error);

				}

			})
			.catch(function (exception) {

				console.error(exception);

				return done(exception);

			});

	});

	it('fetchAll with cache',function (done) {

		var mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				}
			});

		mock.mock(service,'service','isValid')
			.with('fetchAll',scope,{})
			.resolve({});

		mock.mock(service.adapter(),'adapter','fetchAll')
			.with({})
			.resolve([{}]);

		mock.mock(service,'service','isAllowed')
			.with(scope,[{}],'view','get')
			.resolve({});

		service.fetchAll(scope,{},undefined,undefined,undefined,true)
			.then(function (result) {

				try {

					Framework.Expect(result).to.be.eql({});

					return mock.done(done);

				} catch (error) {

					return done(error);

				}

			})
			.catch(function (exception) {

				console.error(exception);

				return done(exception);

			});

	});

	it('fetchAll with cache and result in cache',function (done) {

		var cacheId = 'test_cache_id',
			mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				}
			});

		mock.mock(service,'service','createCacheId')
			.with('fetchAll',{})
			.return(cacheId);

		mock.mock(scope.cache,'cache','get')
			.with(cacheId)
			.return('test');

		service.fetchAll(scope,{},undefined,undefined,undefined,true)
			.then(function (result) {

				try {

					Framework.Expect(result).to.be.eql('test');

					return mock.done(done);

				} catch (error) {

					return done(error);

				}

			})
			.catch(function (exception) {

				console.error(exception);

				return done(exception);

			});

	});

	it('fetchAll with bypass',function (done) {

		var mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				}
			});

		mock.mock(service,'service','isValid')
			.with('fetchAll',scope,{})
			.resolve({});

		mock.mock(service.adapter(),'adapter','fetchAll')
			.with({})
			.resolve([{}]);

		service.fetchAll(scope,{},undefined,undefined,true)
			.then(function (result) {

				try {

					Framework.Expect(result).to.be.eql([{}]);

					return mock.done(done);

				} catch (error) {

					return done(error);

				}

			})
			.catch(function (exception) {

				console.error(exception);

				return done(exception);

			});

	});

	it('fetchOne',function (done) {

		var mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				}
			});

		mock.mock(service,'service','isValid')
			.with('fetchOne',scope,{})
			.resolve({});

		mock.mock(service.adapter(),'adapter','fetchOne')
			.with({})
			.resolve([{}]);

		mock.mock(service,'service','isAllowed')
			.with(scope,{},'view','get')
			.resolve({});

		service.fetchOne(scope,{})
			.then(function (result) {

				try {

					Framework.Expect(result).to.be.eql({});

					return mock.done(done);

				} catch (error) {

					return done(error);

				}

			})
			.catch(function (exception) {

				console.error(exception);

				return done(exception);

			});

	});

	it('fetchOne with bypass',function (done) {

		var mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				}
			});

		mock.mock(service,'service','isValid')
			.with('fetchOne',scope,{})
			.resolve({});

		mock.mock(service.adapter(),'adapter','fetchOne')
			.with({})
			.resolve([{}]);

		service.fetchOne(scope,{},true)
			.then(function (result) {

				try {

					Framework.Expect(result).to.be.eql({});

					return mock.done(done);

				} catch (error) {

					return done(error);

				}

			})
			.catch(function (exception) {

				console.error(exception);

				return done(exception);

			});

	});

	it('fetchOne throw not found',function (done) {

		var mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				}
			});

		mock.mock(service,'service','isValid')
			.with('fetchOne',scope,{})
			.resolve({});

		mock.mock(service.adapter(),'adapter','fetchOne')
			.with({})
			.resolve([]);

		service.fetchOne(scope,{})
			.then(function (result) {

				done(new Error('resolved'));

			})
			.catch(Framework.Exceptions.NotFound,function (exception) {

				mock.done(done);

				return true;

			})
			.catch(done);

	});

	it('fetchOne with cache and result in cache',function (done) {

		var cacheId = 'test_cache_id',
			mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				adapter: function () {
					return new Framework.Adapters.Mysql({})
				}
			});

		mock.mock(service,'service','createCacheId')
			.with('fetchOne',{})
			.return(cacheId);

		mock.mock(scope.cache,'cache','get')
			.with(cacheId)
			.return('test');

		service.fetchOne(scope,{},undefined,true)
			.then(function (result) {

				try {

					Framework.Expect(result).to.be.eql('test');

					return mock.done(done);

				} catch (error) {

					return done(error);

				}

			})
			.catch(function (exception) {

				console.error(exception);

				return done(exception);

			});

	});

	it('fillSet with an object calls fill',function (done) {

		var mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service();

			mock.mock(service,'service','fill')
				.with(scope,{})
				.resolve({filled: true});

			service.fillSet(scope,{})
				.then(function (result) {

					Framework.Expect(result.filled).to.be.true;

					mock.done(done);

				})
				.catch(function (exception) {

					console.error(exception);

					done(exception);

				});

	});

	it('form',function () {

		var service = new Framework.Service();

		form = service.form('test');

		Framework.Expect(form).to.be.equal(undefined);

		service.form('test',function () { return 'test'; });

		form = service.form('test');

		Framework.Expect(form).to.be.equal('test');

	});

	it('isAllowed',function (done) {

		var mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: new Framework.Acl(),
				resource: 'resource'
			});

		mock.mock(service.acl,'acl','isAllowed')
			.with(scope,'resource','privilege',{
				test: 'test'
			})
			.resolve({
				test: 'test'
			});

		service.isAllowed(scope,{
			test: 'test'
		},'privilege').then(function (result) {

			try {

				Framework.Expect(result).to.be.eql({
					test: 'test'
				});

				return mock.done(done);

			} catch (error) {

				return done(error);

			}

		}).catch(function (exception) {

			console.error(exception);

			return done(exception);

		});

	});

	it('isAllowed with attribute',function (done) {

		var mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: new Framework.Acl(),
				resource: 'resource'
			});

		mock.mock(service.acl,'acl','isAllowed')
			.with(scope,'resource','privilege',{
				test: 'test'
			})
			.resolve({
				test: 'test'
			});

		mock.mock(service,'service','allowed')
			.with(scope,{
				test: 'test'
			},'attribute')
			.resolve({
				test: 'test'
			});

		service.isAllowed(scope,{
			test: 'test'
		},'privilege','attribute').then(function (result) {

			try {

				Framework.Expect(result).to.be.eql({
					test: 'test'
				});

				return mock.done(done);

			} catch (error) {

				return done(error);

			}

		}).catch(function (exception) {

			console.error(exception);

			return done(exception);

		});

	});

	it('isAllowed with array',function (done) {

		var mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				acl: new Framework.Acl(),
				resource: 'resource'
			});

		mock.mock(service.acl,'acl','isAllowed')
			.with(scope,'resource','privilege',{
				test: 'test'
			})
			.resolve({
				test: 'test'
			});

		mock.mock(service.acl,'acl','isAllowed')
			.with(scope,'resource','privilege',{
				test: 'test'
			})
			.reject(new Framework.Exceptions.NotAllowed());

		service.isAllowed(scope,[{
			test: 'test'
		},{
			test: 'test'
		}],'privilege').then(function (result) {

			try {

				Framework.Expect(result).to.be.eql([{
					test: 'test'
				}]);

				return mock.done(done);

			} catch (error) {

				return done(error);

			}

		}).catch(function (exception) {

			console.error(exception);

			return done(exception);

		});

	});

	it('isValid',function (done) {

		var mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				forms: {
					add: new Framework.Form()
				}
			});

		mock.mock(service.forms.add,'form','validate')
			.resolve({});

		service.isValid('add',scope,{})
			.then(function (clean) {

				Framework.Expect(clean).to.be.eql({});

				mock.done(done);

			})
			.catch(function (exception) {

				console.error(exception);

				done(exception);

			});

	});

	it('isValid without form',function (done) {

		var mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				forms: {}
			});

		service.isValid('add',scope,{})
			.then(function (clean) {

				Framework.Expect(clean).to.be.eql({});

				mock.done(done);

			})
			.catch(function (exception) {

				console.error(exception);

				done(exception);

			});

	});

});
