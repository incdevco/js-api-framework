var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Attribute',function () {
	
	it('constructor with array',function () {
		
		var attribute = new Framework.Attribute({
			array: ['test'],
			create: 'id',
			service: 'test'
		});
		
		Framework.Expect(attribute.validators.length).to.be.equal(1);
		Framework.Expect(attribute.create).to.be.equal('id');
		Framework.Expect(attribute.service).to.be.equal('test');
		
	});
	
	it('constructor with exists as true',function () {
		
		var attribute = new Framework.Attribute({
			exists: true,
			key: 'id',
			service: 'test'
		});
		
		Framework.Expect(attribute.validators[0] instanceof Framework.Validators.Exists).to.be.true;
		Framework.Expect(attribute.key).to.be.equal('id');
		Framework.Expect(attribute.service).to.be.equal('test');
		
	});
	
	it('constructor with unique as true',function () {
		
		var attribute = new Framework.Attribute({
			unique: true,
			key: 'id',
			service: 'test'
		});
		
		Framework.Expect(attribute.validators[0] instanceof Framework.Validators.NotExists).to.be.true;
		Framework.Expect(attribute.key).to.be.equal('id');
		Framework.Expect(attribute.service).to.be.equal('test');
		
	});
	
	it('default with create',function (done) {
		
		var attribute = new Framework.Attribute({
				create: 'id',
				required: true,
				service: 'test'
			}),
			mock = new Framework.Mock(),
			scope = new Framework.Scope(),
			service = new Framework.Service({
				adapter: new Framework.Adapters.Mysql({})
			});
		
		mock.mock(service.adapter(),'adapter','createId')
			.with('id')
			.resolve('test');
		
		scope.service('test',service);
		
		attribute.default(scope)
			.then(function (result) {
				
				Framework.Expect(result).to.be.equal('test');
				
				mock.done(done);
				
			})
			.catch(function (exception) {
				
				console.error(exception);
				
				done(exception);
				
			});
		
	});
	
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