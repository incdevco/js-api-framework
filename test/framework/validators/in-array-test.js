var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Validators.InArray',function () {

	it('construct with array',function () {

		var validator = new Framework.Validators.InArray({
			values: ['test','dog']
		});

		Framework.Expect(validator.values).to.be.eql(['test','dog']);

	});

	it('allows',function (done) {

		var validator = new Framework.Validators.InArray({
			values: [
				'test',
				'dog',
				'fred'
			]
		});

		validator.validate('dog')
			.then(function () {

				return done();

			})
			.catch(done);

	});

	it('rejects',function (done) {

		var validator = new Framework.Validators.InArray({
			values: [
				'test',
				'dog',
				'fred'
			]
		});

		validator.validate('abc')
			.then(function () {

				return done(new Error('resolved'));

			})
			.catch(Framework.Errors.NotValid,function (exception) {

				Framework.Expect(exception).to.be.eql({
					errors: 'Value Not Allowed'
				});

				return done();

			})
			.catch(done);

	});

});
