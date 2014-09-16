var base = process.env.PWD;

var expect = require('expect.js');

var Framework = require(base+'/framework');

describe('Framework.Form',function () {
	
	it('form.validate',function (done) {
		
		var form = new Framework.Form({
			attributes: {
				id: new Framework.Attribute({
					required: true,
					max: 5,
					min: 4
				}),
				test: new Framework.Attribute({})
			}
		});
		
		form.validate({id: 'test'}).then(function (clean) {
			
			try {
				
				expect(clean).to.be.eql({id: 'test'});
				
				done();
				
			} catch (exception) {
				
				done(exception);
				
			}
			
		}).catch(function (exception) {
			
			console.error(exception);
			
			done(new Error('form.validate rejected'));
			
		});
		
	});
	
	it('form.validate not valid',function (done) {
		
		var form = new Framework.Form({
			attributes: {
				id: new Framework.Attribute({
					required: true
				})
			}
		});
		
		form.validate().then(function (clean) {
			
			done(new Error('form.validate resolved'));
			
		}).catch(function (exception) {
			
			try {
				
				expect(exception).to.be.eql({
					statusCode: 400,
					content: '{"id":"Required"}'
				});
				
				done();
				
			} catch (exception) {
				
				done(exception);
				
			}
			
		});
		
	});
	
});