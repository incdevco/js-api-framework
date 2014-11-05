var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Adapters.Mysql',function () {
	
	it('constructor with array as primary',function () {
		
		var adapter = new Framework.Adapters.Mysql({
			primary: ['id']
		});
		
		Framework.Expect(adapter.primary).to.be.eql(['id']);
		
	});
	
	it('_bootstrap',function () {
		
		var mock = new Framework.Mock(),
			application = new Framework.Application(),
			adapter = new Framework.Adapters.Mysql({});
			
		mock.mock(application,'application','get')
			.with('Mysql')
			.return({
				Pool: 'test'
			});
			
		adapter._bootstrap(application);
		
		Framework.Expect(adapter.pool).to.be.equal('test');
		
	});
	
	it('connection',function (done) {
		
		var connection = {},
			pool = {};
			adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id',
				pool: pool
			}),
			mock = new Framework.Mock();
		
		mock.mock(pool,'pool','getConnection').callback(undefined,connection);
		
		adapter.connection(done);
		
	});
	
	it('createId',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				adapter: 'mysql',
				primary: 'id',
				table: 'test',
				idLength: 5
			}),
			connection = {},
			mock = new Framework.Mock();
		
		mock.mock(adapter,'adapter','connection').callback(undefined,connection);
		
		mock.mock(adapter,'adapter','connection').callback(undefined,connection);
		
		mock.mock(connection,'connection','query').callback(undefined,[{}]);
		
		mock.mock(connection,'connection','query').callback(undefined,[]);
		
		mock.mock(connection,'connection','release')
			.return(true);
		
		mock.mock(connection,'connection','release')
			.return(true);
		
		adapter.createId(undefined,'id').then(function (id) {
			
			try {
				
				Framework.Expect(id.length).to.be.equal(5);
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(done);
		
	});
	
	it('createId connection error',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			connection = {},
			mock = new Framework.Mock(),
			result = {};
		
		mock.mock(adapter,'adapter','connection').callback('Connection Error');
		
		adapter.createId(1,'test').then(function (result) {
			
			return done(new Error('resolved'));
			
		}).catch(function (exception) {
			
			try {
				
				Framework.Expect(exception).to.be.equal('Connection Error');
				
				return mock.done(done);
				
			} catch (exception) {
				
				return done(exception);
				
			}
			
		});
		
	});
	
	it('delete',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			mock = new Framework.Mock();
		
		mock.mock(adapter,'adapter','_delete').resolve({
			affectedRows: 1
		});
		
		adapter.delete({
			id: '1'
		}).then(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.eql({id: '1', _deleted: true});
				
				return mock.done(done);
				
			} catch (exception) {
				
				return done(exception);
				
			}
			
		}).catch(function (exception) {
			
			console.error('delete',exception);
			
			return done(exception);
			
		});
		
	});
	
	it('delete throws exception when no rows affected',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			mock = new Framework.Mock();
		
		mock.mock(adapter,'adapter','_delete').resolve({
			affectedRows: 0
		});
		
		adapter.delete({
			id: '1'
		}).then(function (result) {
			
			return done(new Error('resolved'));
			
		}).catch(function (exception) {
			
			if (exception instanceof Framework.Exceptions.NotDeleted) {
				
				return mock.done(done);
				
			} else {
				
				return done(exception);
				
			}
			
		});
		
	});
	
	it('fetch',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			connection = {},
			mock = new Framework.Mock(),
			result = {};
		
		mock.mock(adapter,'adapter','connection').callback(undefined,connection);
		
		mock.mock(connection,'connection','query')
			.callback(undefined,result)
			.with('SELECT * FROM `test` WHERE `id` = \'1\' LIMIT 1 OFFSET 1');
		
		mock.mock(connection,'connection','release')
			.return(true);
		
		adapter.fetch({
			id: '1'
		},1,1).then(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.eql({});
				
				return mock.done(done);
				
			} catch (exception) {
				
				return done(exception);
				
			}
			
		}).catch(function (exception) {
			
			return done(exception);
			
		});
		
	});
	
	it('createId query error',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			connection = {},
			mock = new Framework.Mock(),
			result = {};
		
		mock.mock(adapter,'adapter','connection').callback(undefined,connection);
		
		mock.mock(connection,'connection','query')
			.callback('Query Error');
		
		mock.mock(connection,'connection','release')
			.return(true);
		
		adapter.createId(5,'id').then(function (result) {
			
			return done(new Error('resolved'));
			
		}).catch(function (exception) {
			
			try {
				
				console.error(exception);
				
				Framework.Expect(exception).to.be.equal('Query Error');
				
				return mock.done(done);
				
			} catch (exception) {
				
				return done(exception);
				
			}
			
		});
		
	});
	
	it('createPrimary',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				adapter: 'mysql',
				primary: 'id',
				table: 'test',
				idLength: 5
			}),
			connection = {},
			mock = new Framework.Mock();
		
		mock.mock(adapter,'adapter','createId').resolve('id');
		
		adapter.createPrimary({}).then(function (model) {
			
			try {
				
				Framework.Expect(model).to.be.eql({id: 'id'});
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(done);
		
	});
	
	it('fetch without where, limit or offset',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			connection = {},
			mock = new Framework.Mock(),
			result = {};
		
		mock.mock(adapter,'adapter','connection').callback(undefined,connection);
		
		mock.mock(connection,'connection','query')
			.callback(undefined,result)
			.with('SELECT * FROM `test`');
		
		mock.mock(connection,'connection','release')
			.return(true);
		
		adapter.fetch().then(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.eql({});
				
				return mock.done(done);
				
			} catch (exception) {
				
				return done(exception);
				
			}
			
		}).catch(function (exception) {
			
			return done(exception);
			
		});
		
	});
	
	it('fetch connection error',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			connection = {},
			mock = new Framework.Mock(),
			result = {};
		
		mock.mock(adapter,'adapter','connection').callback('Connection Error');
		
		adapter.fetch({
			id: '1'
		},1,1).then(function (result) {
			
			return done(new Error('resolved'));
			
		}).catch(function (exception) {
			
			try {
				
				Framework.Expect(exception).to.be.equal('Connection Error');
				
				return mock.done(done);
				
			} catch (exception) {
				
				return done(exception);
				
			}
			
		});
		
	});
	
	it('fetch query error',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			connection = {},
			mock = new Framework.Mock(),
			result = {};
		
		mock.mock(adapter,'adapter','connection').callback(undefined,connection);
		
		mock.mock(connection,'connection','query')
			.callback('Query Error')
			.with('SELECT * FROM `test` WHERE `id` = \'1\' LIMIT 1 OFFSET 1');
		
		mock.mock(connection,'connection','release')
			.return(true);
		
		adapter.fetch({
			id: '1'
		},1,1).then(function (result) {
			
			return done(new Error('resolved'));
			
		}).catch(function (exception) {
			
			try {
				
				Framework.Expect(exception).to.be.equal('Query Error');
				
				return mock.done(done);
				
			} catch (exception) {
				
				return done(exception);
				
			}
			
		});
		
	});
	
	it('insert',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			mock = new Framework.Mock();
		
		mock.mock(adapter,'adapter','_insert').resolve({
			affectedRows: 1
		});
		
		mock.mock(adapter,'adapter','createPrimary').resolve({
			id: '1'
		});
		
		adapter.insert({}).then(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.eql({id: '1', _added: true});
				
				return mock.done(done);
				
			} catch (exception) {
				
				return done(exception);
				
			}
			
		}).catch(function (exception) {
			
			console.error('insert',exception);
			
			return done(exception);
			
		});
		
	});
	
	it('insert throws exception when no rows affected',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			mock = new Framework.Mock();
		
		mock.mock(adapter,'adapter','_insert').resolve({
			affectedRows: 0
		});
		
		adapter.insert({
			id: '1'
		}).then(function (result) {
			
			return done(new Error('resolved'));
			
		}).catch(function (exception) {
			
			if (exception instanceof Framework.Exceptions.NotInserted) {
				
				return mock.done(done);
				
			} else {
				
				return done(exception);
				
			}
			
		});
		
	});
	
	it('update',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			mock = new Framework.Mock();
		
		mock.mock(adapter,'adapter','_update').resolve({
			affectedRows: 1
		});
		
		adapter.update({
			id: '1'
		}).then(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.eql({id: '1', _saved: true});
				
				return mock.done(done);
				
			} catch (exception) {
				
				return done(exception);
				
			}
			
		}).catch(function (exception) {
			
			console.error('update',exception);
			
			return done(exception);
			
		});
		
	});
	
	it('update throws exception when no rows affected',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			mock = new Framework.Mock();
		
		mock.mock(adapter,'adapter','_update').resolve({
			affectedRows: 0
		});
		
		adapter.update({
			id: '1'
		}).then(function (result) {
			
			return done(new Error('resolved'));
			
		}).catch(function (exception) {
			
			if (exception instanceof Framework.Exceptions.NotUpdated) {
				
				return mock.done(done);
				
			} else {
				
				return done(exception);
				
			}
			
		});
		
	});
	
	it('_delete',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			connection = {},
			mock = new Framework.Mock(),
			result = {};
		
		mock.mock(adapter,'adapter','connection').callback(undefined,connection);
		
		mock.mock(connection,'connection','query')
			.callback(undefined,result)
			.with('DELETE FROM `test` WHERE `id` = \'1\'');
		
		mock.mock(connection,'connection','release')
			.return(true);
		
		adapter._delete({
			id: '1'
		}).then(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.eql({});
				
				return mock.done(done);
				
			} catch (exception) {
				
				return done(exception);
				
			}
			
		}).catch(function (exception) {
			
			return done(exception);
			
		});
		
	});
	
	it('_delete without where',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			connection = {},
			mock = new Framework.Mock(),
			result = {};
		
		mock.mock(adapter,'adapter','connection').callback(undefined,connection);
		
		mock.mock(connection,'connection','query')
			.callback(undefined,result)
			.with('DELETE FROM `test`');
		
		mock.mock(connection,'connection','release')
			.return(true);
		
		adapter._delete().then(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.eql({});
				
				return mock.done(done);
				
			} catch (exception) {
				
				return done(exception);
				
			}
			
		}).catch(function (exception) {
			
			return done(exception);
			
		});
		
	});
	
	it('_delete with connection error',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			connection = {},
			mock = new Framework.Mock(),
			result = {};
		
		mock.mock(adapter,'adapter','connection').callback('No Connection');
		
		adapter._delete().then(function (result) {
			
			return done(new Error('resolved'));
			
		}).catch(function (exception) {
			
			try {
				
				Framework.Expect(exception).to.be.equal('No Connection');
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
	it('_delete with query error',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			connection = {},
			mock = new Framework.Mock(),
			result = {};
		
		mock.mock(adapter,'adapter','connection').callback(undefined,connection);
		
		mock.mock(connection,'connection','query')
			.callback('Query Error')
			.with('DELETE FROM `test`');
		
		mock.mock(connection,'connection','release')
			.return(true);
		
		adapter._delete().then(function (result) {
			
			return done(new Error('resolved'));
			
		}).catch(function (exception) {
			
			try {
				
				Framework.Expect(exception).to.be.equal('Query Error');
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
	it('_insert',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			connection = {},
			mock = new Framework.Mock(),
			result = {};
		
		mock.mock(adapter,'adapter','connection').callback(undefined,connection);
		
		mock.mock(connection,'connection','query')
			.callback(undefined,result)
			.with('INSERT INTO `test` (`id`) VALUES (\'1\')');
		
		mock.mock(connection,'connection','release')
			.return(true);
		
		adapter._insert({
			id: '1'
		}).then(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.eql({});
				
				return mock.done(done);
				
			} catch (exception) {
				
				return done(exception);
				
			}
			
		}).catch(function (exception) {
			
			return done(exception);
			
		});
		
	});
	
	it('_insert with connection error',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			connection = {},
			mock = new Framework.Mock(),
			result = {};
		
		mock.mock(adapter,'adapter','connection').callback('No Connection');
		
		adapter._insert({
			id: '1'
		}).then(function (result) {
			
			return done(new Error('resolved'));
			
		}).catch(function (exception) {
			
			try {
				
				Framework.Expect(exception).to.be.equal('No Connection');
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
	it('_insert with query error',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			connection = {},
			mock = new Framework.Mock(),
			result = {};
		
		mock.mock(adapter,'adapter','connection').callback(undefined,connection);
		
		mock.mock(connection,'connection','query')
			.callback('Query Error')
			.with('INSERT INTO `test` (`id`) VALUES (\'1\')');
		
		mock.mock(connection,'connection','release')
			.return(true);
		
		adapter._insert({
			id: '1'
		}).then(function (result) {
			
			return done(new Error('resolved'));
			
		}).catch(function (exception) {
			
			try {
				
				Framework.Expect(exception).to.be.equal('Query Error');
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
	it('_update',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			connection = {},
			mock = new Framework.Mock(),
			result = {};
		
		mock.mock(adapter,'adapter','connection').callback(undefined,connection);
		
		mock.mock(connection,'connection','query')
			.callback(undefined,result)
			.with('UPDATE `test` SET `id` = \'1\' WHERE `id` = \'1\'');
		
		mock.mock(connection,'connection','release')
			.return(true);
		
		adapter._update({
			id: '1'
		},{
			id: '1'
		}).then(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.eql({});
				
				return mock.done(done);
				
			} catch (exception) {
				
				return done(exception);
				
			}
			
		}).catch(function (exception) {
			
			return done(exception);
			
		});
		
	});
	
	it('_update without where',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			connection = {},
			mock = new Framework.Mock(),
			result = {};
		
		mock.mock(adapter,'adapter','connection')
			.callback(undefined,connection);
		
		mock.mock(connection,'connection','query')
			.callback(undefined,result)
			.with('UPDATE `test` SET `id` = \'1\'');
		
		mock.mock(connection,'connection','release')
			.return(true);
		
		adapter._update({
			id: '1'
		}).then(function (result) {
			
			try {
				
				Framework.Expect(result).to.be.eql({});
				
				return mock.done(done);
				
			} catch (exception) {
				
				return done(exception);
				
			}
			
		}).catch(function (exception) {
			
			return done(exception);
			
		});
		
	});
	
	it('_update with connection error',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			connection = {},
			mock = new Framework.Mock(),
			result = {};
		
		mock.mock(adapter,'adapter','connection').callback('No Connection');
		
		adapter._update({
			id: '1'
		},{
			id: '1'
		}).then(function (result) {
			
			return done(new Error('resolved'));
			
		}).catch(function (exception) {
			
			try {
				
				Framework.Expect(exception).to.be.equal('No Connection');
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
	it('_update with query error',function (done) {
		
		var adapter = new Framework.Adapters.Mysql({
				table: 'test',
				primary: 'id'
			}),
			connection = {},
			mock = new Framework.Mock(),
			result = {};
		
		mock.mock(adapter,'adapter','connection').callback(undefined,connection);
		
		mock.mock(connection,'connection','query')
			.callback('Query Error')
			.with('UPDATE `test` SET `id` = \'1\' WHERE `id` = \'1\'');
			
		mock.mock(connection,'connection','release')
			.return(true);
		
		adapter._update({
			id: '1'
		},{
			id: '1'
		}).then(function (result) {
			
			return done(new Error('resolved'));
			
		}).catch(function (exception) {
			
			try {
				
				Framework.Expect(exception).to.be.equal('Query Error');
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
});