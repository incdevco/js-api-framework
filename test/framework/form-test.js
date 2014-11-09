var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Form',function () {
	
	it('constructor',function () {
		
		var attribute = new Framework.Attribute(),
			form = new Framework.Form({
				attributes: {
					test: attribute,
					dog: function () { return attribute; }
				}
			});
		
		Framework.Expect(form.attribute('test')).to.be.eql(attribute);
		Framework.Expect(form.attributes.dog).to.be.eql(attribute);
		
	});
	
	it('validate',function (done) {
		
		var form = new Framework.Form(),
			id = new Framework.Attribute(),
			mock = new Framework.Mock(),
			scope = new Framework.Scope();
		
		form.attributes.id = id;
		
		form.validate(scope,{
			id: '1',
			test: 'test'
		}).then(function (clean) {
			
			try {
				
				Framework.Expect(clean).to.be.eql({
					id: '1'
				});
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		}).catch(done);
		
	});
	
	it('validate rejects',function (done) {
		
		var form = new Framework.Form(),
			id = new Framework.Attribute(),
			mock = new Framework.Mock(),
			scope = new Framework.Scope();
			
		id.validators.push(new Framework.Validators.Alpha());
		id.validators.push(new Framework.Validators.Email());
		
		form.attributes.id = id;
		
		form.validate(scope,{
			id: '1'
		}).then(function (clean) {
			
			return done(new Error('resolved'));
			
		}).catch(function (exception) {
			
			try {
				
				Framework.Expect(exception.errors).to.be.eql({
					id: 'Only Alpha Characters Allowed (1)'
				});
				
				return mock.done(done);
				
			} catch (error) {
				
				return done(error);
				
			}
			
		});
		
	});
	
});