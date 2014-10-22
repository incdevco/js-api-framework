var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Attribute',function () {
	
	it('validate resolves when required',function (done) {
		
		var attribute = new Framework.Attribute({
				required: true
			}),
			scope = new Framework.Scope(),
			value = 'test',
			context = {};
		
		attribute.validate(scope,value,context).then(function () {
			
			return done();
			
		}).catch(done);
		
	});
	
	it('validate resolves when not required',function (done) {
		
		var attribute = new Framework.Attribute(),
			scope = new Framework.Scope(),
			value = undefined,
			context = {};
		
		attribute.validate(scope,value,context).then(function () {
			
			return done();
			
		}).catch(done);
		
	});
	
	it('validate reject',function (done) {
		
		var attribute = new Framework.Attribute({
				required: true
			}),
			scope = new Framework.Scope(),
			value = undefined,
			context = {};
		
		attribute.validate(scope,value,context).then(function () {
			
			return done(new Error('resolve'));
			
		}).catch(function () {
			
			return done();
			
		});
		
	});
	
	it('validate resolves with max and min',function (done) {
		
		var attribute = new Framework.Attribute({
				max: 5,
				min: 4
			}),
			scope = new Framework.Scope(),
			value = 'test',
			context = {};
		
		attribute.validate(scope,value,context).then(function () {
			
			return done();
			
		}).catch(done);
		
	});
	
	it('validate rejects with max and min',function (done) {
		
		var attribute = new Framework.Attribute({
				max: 5,
				min: 4
			}),
			scope = new Framework.Scope(),
			value = 'tested',
			context = {};
		
		attribute.validate(scope,value,context).then(function () {
			
			return done(new Error('resolved'));
			
		}).catch(function () {
			
			return done();
			
		});
		
	});
	
	it('contruct with config.exists',function () {
		
		var attribute = new Framework.Attribute({
				exists: {}
			}),
			scope = new Framework.Scope(),
			value = 'test',
			context = {};
		
		Framework.Expect(attribute.validators.length).to.be.equal(1);
		
	});
	
});