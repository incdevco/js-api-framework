var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Cache',function () {
	
	it('delete',function () {
		
		var cache = new Framework.Cache();
		
		cache.put('test','test');
		
		Framework.Expect(cache.get('test')).to.be.equal('test');
		
		cache.delete('test');
		
		Framework.Expect(cache.get('test')).to.be.equal(undefined);
		
	});
	
	it('get',function () {
		
		var cache = new Framework.Cache();
		
		Framework.Expect(cache.get('test')).to.be.equal(undefined);
		
		cache.put('test','test');
		
		Framework.Expect(cache.get('test')).to.be.equal('test');
		
	});
	
	it('put',function () {
		
		var cache = new Framework.Cache();
		
		Framework.Expect(cache.get('test')).to.be.equal(undefined);
		
		cache.put('test','test');
		
		Framework.Expect(cache.get('test')).to.be.equal('test');
		
	});
	
});