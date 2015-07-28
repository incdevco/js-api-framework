var base = process.env.PWD;

var Framework = require(+'/framework');

describe('Framework.Validators.Alphanumeric',function () {

	it('allows a-z and 0-9',function (done) {

		var validator = new Framework.Validators.Alphanumeric();

		validator.validate('abcdefghijklmnopqrstuvwxyz0123456789')
			.then(function () {

				return done();

			})
			.catch(done);

	});

	it('rejects -*&^%$',function (done) {

		var validator = new Framework.Validators.Alphanumeric();

		validator.validate('abcdefg01&*^@23456789')
			.then(function () {

				return done(new Error('resolved'));

			})
			.catch(Framework.Errors.NotValid,function (exception) {

				Framework.Expect(exception).to.be.eql({
					errors: 'Only Alphanumeric Characters Allowed',
          name: 'NotValid'
				});

				return done();

			})
			.catch(done);

	});

});
