var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Validators.Email',function () {

	it('allows a-z and 0-9',function (done) {

		var validator = new Framework.Validators.Email();

		validator.validate('test@test.com')
			.then(function () {

				return done();

			})
			.catch(done);

	});

	it('rejects -*&^%$',function (done) {

		var validator = new Framework.Validators.Email();

		validator.validate('abcdefg01&*^@23456789')
			.then(function () {

				return done(new Error('resolved'));

			})
			.catch(Framework.Errors.NotValid,function (exception) {

				Framework.Expect(exception).to.be.eql({
					errors: 'Not Valid Email Address',
					name: 'NotValid'
				});

				return done();

			})
			.catch(done);

	});

});
