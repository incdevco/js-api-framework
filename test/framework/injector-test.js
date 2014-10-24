var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Injector',function () {
	
	it('get',function () {
		
		var injector = new Framework.Injector();
		
		Framework.Expect(injector.get('test')).to.be.equal(undefined);
		
		injector.set('test','test');
		
		Framework.Expect(injector.get('test')).to.be.equal('test');
		
	});
	
	it('get with Injector',function () {
		
		var injector = new Framework.Injector();
		
		Framework.Expect(injector.get('Injector')).to.be.equal(injector);
		
	});
	
	it('get with parent',function () {
		
		var parent = new Framework.Injector(), 
			injector = new Framework.Injector(parent);
		
		Framework.Expect(injector.get('test')).to.be.equal(undefined);
		
		parent.set('test','test');
		
		Framework.Expect(injector.get('test')).to.be.equal('test');
		
	});
	
	it('invoke',function () {
		
		var injector = new Framework.Injector(), 
			injectable = [
				'test',
				function (test) {
					return test;
				}
			];
		
		injector.set('test','test');
		
		Framework.Expect(injector.invoke(injectable)).to.be.equal('test');
		
	});
	
	it('invoke with local',function () {
		
		var injector = new Framework.Injector(), 
			injectable = [
				'test',
				function (test) {
					return test;
				}
			];
		
		Framework.Expect(injector.get('test')).to.be.equal(undefined);
		
		injector.set('test','test');
		
		Framework.Expect(injector.get('test')).to.be.equal('test');
		
		Framework.Expect(injector.invoke(injectable,{test:'test1'})).to.be.equal('test1');
		
	});
	
	it('invoke with array',function () {
		
		var injector = new Framework.Injector(), 
			injectable = [
				[
					'test',
					function (test) {
						return 'test1';
					}
				],
				function (test) {
					return test;
				}
			];
		
		injector.set('test','test');
		
		Framework.Expect(injector.get('test')).to.be.equal('test');
		
		Framework.Expect(injector.invoke(injectable,{test:'test1'})).to.be.equal('test1');
		
	});
	
	it('module with parent',function () {
		
		var parent = new Framework.Injector(), 
			injector = new Framework.Injector(parent);
		
		Framework.Expect(injector.module('test')).to.be.equal(undefined);
		
		parent.module('test','test');
		
		Framework.Expect(injector.module('test')).to.be.equal('test');
		
	});
	
	it('service with parent',function () {
		
		var parent = new Framework.Injector(), 
			injector = new Framework.Injector(parent);
		
		Framework.Expect(injector.service('test')).to.be.equal(undefined);
		
		parent.service('test','test');
		
		Framework.Expect(injector.service('test')).to.be.equal('test');
		
	});
	
});