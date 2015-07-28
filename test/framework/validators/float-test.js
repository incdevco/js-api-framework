var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Validators.Float',function () {

	it('allows a-z and 0-9',function (done) {

		var validator = new Framework.Validators.Float();

		validator.validate('10.05')
			.then(function () {

				return done();

			})
			.catch(done);

	});

	it('rejects -*&^%$',function (done) {

		var validator = new Framework.Validators.Float();

		validator.validate('abcdefg01&*^@23456789')
			.then(function () {

				return done(new Error('resolved'));

			})
			.catch(Framework.Errors.NotValid,function (exception) {

				Framework.Expect(exception).to.be.eql({
					errors: 'Not Valid Float',
					name: 'NotValid'
				});

				return done();

			})
			.catch(done);

	});

});
