var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Validators.PhoneNumber',function () {

	it('allows',function (done) {

		var validator = new Framework.Validators.PhoneNumber();

		validator.validate('0123456789')
			.then(function () {

				return done();

			})
			.catch(done);

	});

	it('rejects -*&^%$',function (done) {

		var validator = new Framework.Validators.PhoneNumber();

		validator.validate('abcdefg01&*^@23456789')
			.then(function () {

				return done(new Error('resolved'));

			})
			.catch(Framework.Errors.NotValid,function (error) {

				Framework.Expect(error).to.be.eql({
					errors: 'Only + and 0-9 Allowed',
					name: 'NotValid'
				});

				return done();

			})
			.catch(done);

	});

});
