var base = process.env.PWD;

var expect = require('expect.js');

var Framework = require(base+'/framework');

describe('Framework.MysqlAdapter',function () {
	
	it('adapter.connection',function (done) {
		
		var mock = new Framework.Mock(),
			mysql = {
				pool: {}
			},
			adapter = new Framework.MysqlAdapter({
				mysql: mysql,
				table: 'test'
			}),
			scope = new Framework.Scope();
		
		mock.object(mysql.pool,{
			name: 'getConnection',
			callback: {
				argument: 0,
				error: null,
				result: {}
			}
		});
		
		adapter.connection(scope).then(function (connection) {
			
			mock.done(done);
			
		}).catch(function (exception) {
			
			console.error(exception,exception.stack);
			
			done(new Error('adapter.connection rejected'));
			
		});
		
	});
	
	it('adapter.connection with error',function (done) {
		
		var mock = new Framework.Mock(),
			mysql = {
				pool: {}
			},
			adapter = new Framework.MysqlAdapter({
				mysql: mysql,
				table: 'test'
			}),
			scope = new Framework.Scope();
		
		mock.object(mysql.pool,{
			name: 'getConnection',
			callback: {
				argument: 0,
				error: 'test',
				result: {}
			}
		});
		
		adapter.connection(scope).then(function (connection) {
			
			done(new Error('adapter.connection resolved'));
			
		}).catch(function (exception) {
			
			mock.done(done);
			
		});
		
	});
	
	it('adapter.delete',function (done) {
		
		var connection = {},
			deferred = new Framework.Deferred(),
			mock = new Framework.Mock(),
			adapter = new Framework.MysqlAdapter({
				table: 'test'
			}),
			scope = new Framework.Scope();
			
		mock.object(adapter,{
			name: 'connection',
			'return': deferred.promise
		});
		
		mock.object(connection,{
			name: 'query',
			callback: {
				argument: 1,
				error: null,
				result: {
					rowsAffected: 1
				}
			}
		});
		
		mock.object(connection,{
			name: 'release',
			'return': true
		});
		
		deferred.resolve(connection);
		
		adapter.delete({test: 'test'},1,0,scope).then(function (result) {
			
			mock.done(done);
			
		}).catch(function (exception) {
			
			console.error(exception,exception.stack);
			
			done(new Error('adapter.delete rejected'));
			
		});
		
	});
	
	it('adapter.delete with error',function (done) {
		
		var connection = {},
			deferred = new Framework.Deferred(),
			mock = new Framework.Mock(),
			adapter = new Framework.MysqlAdapter({
				table: 'test'
			}),
			scope = new Framework.Scope();
			
		mock.object(adapter,{
			name: 'connection',
			'return': deferred.promise
		});
		
		mock.object(connection,{
			name: 'query',
			callback: {
				argument: 1,
				error: 'Test',
				result: {
					rowsAffected: 0
				}
			}
		});
		
		mock.object(connection,{
			name: 'release',
			'return': true
		});
		
		deferred.resolve(connection);
		
		adapter.delete({},1,0,scope).then(function (result) {
			
			done(new Error('adapter.delete resolved'));
			
		}).catch(function (exception) {
			
			mock.done(done);
			
		});
		
	});
	
	it('adapter.fetchAll',function (done) {
		
		var connection = {},
			deferred = new Framework.Deferred(),
			mock = new Framework.Mock(),
			adapter = new Framework.MysqlAdapter({
				table: 'test'
			}),
			scope = new Framework.Scope();
			
		mock.object(adapter,{
			name: 'connection',
			'return': deferred.promise
		});
		
		mock.object(connection,{
			name: 'query',
			callback: {
				argument: 1,
				error: null,
				result: {
					rowsAffected: 1
				}
			}
		});
		
		mock.object(connection,{
			name: 'release',
			'return': true
		});
		
		deferred.resolve(connection);
		
		adapter.fetchAll({test: 'test'},1,0,scope).then(function (result) {
			
			mock.done(done);
			
		}).catch(function (exception) {
			
			console.error(exception,exception.stack);
			
			done(new Error('adapter.fetchAll rejected'));
			
		});
		
	});
	
	it('adapter.fetchAll with error',function (done) {
		
		var connection = {},
			deferred = new Framework.Deferred(),
			mock = new Framework.Mock(),
			adapter = new Framework.MysqlAdapter({
				table: 'test'
			}),
			scope = new Framework.Scope();
			
		mock.object(adapter,{
			name: 'connection',
			'return': deferred.promise
		});
		
		mock.object(connection,{
			name: 'query',
			callback: {
				argument: 1,
				error: 'Test',
				result: {
					rowsAffected: 0
				}
			}
		});
		
		mock.object(connection,{
			name: 'release',
			'return': true
		});
		
		deferred.resolve(connection);
		
		adapter.fetchAll({},1,0,scope).then(function (result) {
			
			done(new Error('adapter.fetchAll rejected'));
			
		}).catch(function (exception) {
			
			mock.done(done);
			
		});
		
	});
	
	it('adapter.fetchRow',function (done) {
		
		var connection = {},
			deferred = new Framework.Deferred(),
			mock = new Framework.Mock(),
			adapter = new Framework.MysqlAdapter({
				table: 'test'
			}),
			scope = new Framework.Scope();
			
		mock.object(adapter,{
			name: 'connection',
			'return': deferred.promise
		});
		
		mock.object(connection,{
			name: 'query',
			callback: {
				argument: 1,
				error: null,
				result: {
					rowsAffected: 1
				}
			}
		});
		
		mock.object(connection,{
			name: 'release',
			'return': true
		});
		
		deferred.resolve(connection);
		
		adapter.fetchRow({test: 'test'},1,0,scope).then(function (result) {
			
			mock.done(done);
			
		}).catch(function (exception) {
			
			console.error(exception,exception.stack);
			
			done(new Error('adapter.fetchRow rejected'));
			
		});
		
	});
	
	it('adapter.fetchRow with error',function (done) {
		
		var connection = {},
			deferred = new Framework.Deferred(),
			mock = new Framework.Mock(),
			adapter = new Framework.MysqlAdapter({
				table: 'test'
			}),
			scope = new Framework.Scope();
			
		mock.object(adapter,{
			name: 'connection',
			'return': deferred.promise
		});
		
		mock.object(connection,{
			name: 'query',
			callback: {
				argument: 1,
				error: 'Test',
				result: {
					rowsAffected: 0
				}
			}
		});
		
		mock.object(connection,{
			name: 'release',
			'return': true
		});
		
		deferred.resolve(connection);
		
		adapter.fetchRow({},0,scope).then(function (result) {
			
			done(new Error('adapter.fetchRow rejected'));
			
		}).catch(function (exception) {
			
			mock.done(done);
			
		});
		
	});
	
	it('adapter.insert',function (done) {
		
		var connection = {},
			deferred = new Framework.Deferred(),
			mock = new Framework.Mock(),
			adapter = new Framework.MysqlAdapter({
				table: 'test'
			}),
			scope = new Framework.Scope();
			
		mock.object(adapter,{
			name: 'connection',
			'return': deferred.promise
		});
		
		mock.object(connection,{
			name: 'query',
			callback: {
				argument: 1,
				error: null,
				result: {
					rowsAffected: 1
				}
			}
		});
		
		mock.object(connection,{
			name: 'release',
			'return': true
		});
		
		deferred.resolve(connection);
		
		adapter.insert({test: 'test'},scope).then(function (result) {
			
			mock.done(done);
			
		}).catch(function (exception) {
			
			console.error(exception,exception.stack);
			
			done(new Error('adapter.insert rejected'));
			
		});
		
	});
	
	it('adapter.insert with error',function (done) {
		
		var connection = {},
			deferred = new Framework.Deferred(),
			mock = new Framework.Mock(),
			adapter = new Framework.MysqlAdapter({
				table: 'test'
			}),
			scope = new Framework.Scope();
			
		mock.object(adapter,{
			name: 'connection',
			'return': deferred.promise
		});
		
		mock.object(connection,{
			name: 'query',
			callback: {
				argument: 1,
				error: 'Test',
				result: {
					rowsAffected: 0
				}
			}
		});
		
		mock.object(connection,{
			name: 'release',
			'return': true
		});
		
		deferred.resolve(connection);
		
		adapter.insert({},scope).then(function (result) {
			
			done(new Error('adapter.insert rejected'));
			
		}).catch(function (exception) {
			
			mock.done(done);
			
		});
		
	});
	
	it('adapter.update',function (done) {
		
		var connection = {},
			deferred = new Framework.Deferred(),
			mock = new Framework.Mock(),
			adapter = new Framework.MysqlAdapter({
				table: 'test'
			}),
			scope = new Framework.Scope();
			
		mock.object(adapter,{
			name: 'connection',
			'return': deferred.promise
		});
		
		mock.object(connection,{
			name: 'query',
			callback: {
				argument: 1,
				error: null,
				result: {
					rowsAffected: 1
				}
			}
		});
		
		mock.object(connection,{
			name: 'release',
			'return': true
		});
		
		deferred.resolve(connection);
		
		adapter.update({test: 'test'},{test: 'test'},scope).then(function (result) {
			
			mock.done(done);
			
		}).catch(function (exception) {
			
			console.error(exception,exception.stack);
			
			done(new Error('adapter.update rejected'));
			
		});
		
	});
	
	it('adapter.update with error',function (done) {
		
		var connection = {},
			deferred = new Framework.Deferred(),
			mock = new Framework.Mock(),
			adapter = new Framework.MysqlAdapter({
				table: 'test'
			}),
			scope = new Framework.Scope();
			
		mock.object(adapter,{
			name: 'connection',
			'return': deferred.promise
		});
		
		mock.object(connection,{
			name: 'query',
			callback: {
				argument: 1,
				error: 'Test',
				result: {
					rowsAffected: 0
				}
			}
		});
		
		mock.object(connection,{
			name: 'release',
			'return': true
		});
		
		deferred.resolve(connection);
		
		adapter.update({},{},scope).then(function (result) {
			
			done(new Error('adapter.update rejected'));
			
		}).catch(function (exception) {
			
			mock.done(done);
			
		});
		
	});
	
});