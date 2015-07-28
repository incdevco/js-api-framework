var base = process.env.PWD;

var Framework = require(+'/framework');

describe('Framework.Validators.Length',function () {

	it('allows',function (done) {

		var validator = new Framework.Validators.Length({
			max: 5,
			min: 3
		});

		validator.validate('abcde')
			.then(function () {

				return done();

			})
			.catch(done);

	});

	it('allows with number',function (done) {

		var validator = new Framework.Validators.Length({
			max: 5,
			min: 3
		});

		validator.validate(5555)
			.then(function () {

				return done();

			})
			.catch(done);

	});

	it('allows with object',function (done) {

		var validator = new Framework.Validators.Length({
			max: 5,
			min: 3
		});

		validator.validate({})
			.then(function () {

				return done();

			})
			.catch(done);

	});

	it('rejects to long',function (done) {

		var validator = new Framework.Validators.Length({
			max: 5,
			min: 3
		});

		validator.validate('abcdefg0123456789')
			.then(function () {

				return done(new Error('resolved'));

			})
			.catch(Framework.Errors.NotValid,function (exception) {

				Framework.Expect(exception).to.be.eql({
					errors: 'Too Long',
					name: 'NotValid'
				});

				return done();

			})
			.catch(done);

	});

	it('rejects to short',function (done) {

		var validator = new Framework.Validators.Length({
			max: 5,
			min: 5
		});

		validator.validate('abc')
			.then(function () {

				return done(new Error('resolved'));

			})
			.catch(Framework.Errors.NotValid,function (exception) {

				Framework.Expect(exception).to.be.eql({
					errors: 'Too Short',
					name: 'NotValid'
				});

				return done();

			})
			.catch(done);

	});

});
