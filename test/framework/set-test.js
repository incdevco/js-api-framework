var base = process.env.PWD;

var expect = require('expect.js');

var Framework = require(base+'/framework');

describe('Framework.Set',function () {
	
	it('set.first',function () {
		
		var first = {id: 1}, second = {id: 2},set = new Framework.Set();
		
		set.push(first);
		set.push(second);
		
		expect(set.first()).to.be.eql(first);
		
	});
	
	it('set.forEach',function () {
		
		var first = {id: 1}, second = {id: 2},set = new Framework.Set();
		
		set.push(first);
		set.push(second);
		
		set.forEach(function (model) {
			
			model.id = 'test';
			
		});
		
		expect(first).to.be.eql({id: 'test'});
		expect(second).to.be.eql({id: 'test'});
		
	});
	
	it('set.indexOf',function () {
		
		var first = {id: 1}, second = {id: 2},set = new Framework.Set();
		
		set.push(first);
		set.push(second);
		
		expect(set.indexOf(first)).to.be.equal(0);
		expect(set.indexOf(second)).to.be.equal(1);
		
	});
	
	it('set.splice',function () {
		
		var first = {id: 1}, second = {id: 2},set = new Framework.Set();
		
		set.push(first);
		set.push(second);
		
		expect(set.length).to.be.equal(2);
		
		set.splice(1,1);
		
		expect(set.length).to.be.equal(1);
		
	});
	
	it('set.toData',function (done) {
		
		var deferred1 = new Framework.Deferred(),
			deferred2 = new Framework.Deferred(),
			first = {id: 1},
			mock = new Framework.Mock(), 
			second = {id: 2},
			set = new Framework.Set();
		
		mock.object(first,{
			name: 'toData',
			'return': deferred1.promise
		});
		
		mock.object(second,{
			name: 'toData',
			'return': deferred2.promise
		});
		
		set.push(first);
		set.push(second);
		
		deferred1.resolve({id: 1});
		deferred2.resolve({id: 2});
		
		set.toData({}).then(function (data) {
			
			try {
				
				expect(data).to.be.eql([{id: 1},{id: 2}]);
				
				mock.done(done);
				
			} catch (exception) {
				
				done(exception);
				
			}
			
		});
		
	});
	
	it('set.toJson',function (done) {
		
		var deferred1 = new Framework.Deferred(),
			deferred2 = new Framework.Deferred(),
			first = {id: 1},
			mock = new Framework.Mock(), 
			second = {id: 2},
			set = new Framework.Set();
		
		mock.object(first,{
			name: 'toData',
			'return': deferred1.promise
		});
		
		mock.object(second,{
			name: 'toData',
			'return': deferred2.promise
		});
		
		set.push(first);
		set.push(second);
		
		deferred1.resolve({id: 1});
		deferred2.resolve({id: 2});
		
		set.toJson({}).then(function (data) {
			
			try {
				
				expect(data).to.be.eql(JSON.stringify([{id: 1},{id: 2}]));
				
				mock.done(done);
				
			} catch (exception) {
				
				done(exception);
				
			}
			
		});
		
	});
	
});