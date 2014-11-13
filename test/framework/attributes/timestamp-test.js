var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Attributes.Timestamp',function () {
	
	it('constructor',function () {
		
		var attribute = new Framework.Attributes.Timestamp();
		
		Framework.Expect(attribute.max).to.be.equal(20);
		Framework.Expect(attribute.validators[0] instanceof Framework.Validators.Float).to.be.true;
		
	});
	
	it('constructor with validators',function () {
		
		var attribute = new Framework.Attributes.Timestamp({
			validators: []
		});
		
		Framework.Expect(attribute.validators.length).to.be.equal(1);
		Framework.Expect(attribute.validators[0] instanceof Framework.Validators.Length).to.be.true;
		
	});
	
	it('should set default with scope.time with now as true',function (done) {
		
		var attribute = new Framework.Attributes.Timestamp({
				now: true,
				required: true
			}),
			scope = new Framework.Scope();
		
		scope.time = Framework.Moment();
		
		attribute.default(scope)
			.then(function (result) {
			
				Framework.Expect(result).to.be.equal(scope.time.valueOf());
				
				done();
			
			})
			.catch(function (exception) {
				
				console.error(exception);
				
				done(exception);
				
			});
		
	});
	
	it('should set default as undefined when required = false',function (done) {
		
		var attribute = new Framework.Attributes.Timestamp({
				now: true
			}),
			scope = new Framework.Scope();
		
		scope.time = Framework.Moment();
		
		attribute.default(scope)
			.then(function (result) {
			
				Framework.Expect(result).to.be.equal(undefined);
				
				done();
			
			})
			.catch(function (exception) {
				
				console.error(exception);
				
				done(exception);
				
			});
		
	});
	
	it('should set default as this._default when required = true and this.now = false',function (done) {
		
		var attribute = new Framework.Attributes.Timestamp({
				'default': 'test',
				now: false,
				required: true
			}),
			scope = new Framework.Scope();
		
		scope.time = Framework.Moment();
		
		attribute.default(scope)
			.then(function (result) {
			
				Framework.Expect(result).to.be.equal('test');
				
				done();
			
			})
			.catch(function (exception) {
				
				console.error(exception);
				
				done(exception);
				
			});
		
	});
	
});