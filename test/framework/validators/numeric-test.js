var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Validators.Numeric',function () {

	it('allows 0-9',function (done) {

		var validator = new Framework.Validators.Numeric();

		validator.validate('0123456789')
			.then(function () {

				return done();

			})
			.catch(done);

	});

	it('rejects -*&^%$',function (done) {

		var validator = new Framework.Validators.Numeric();

		validator.validate('abcdefg01&*^@23456789')
			.then(function () {

				return done(new Error('resolved'));

			})
			.catch(Framework.Errors.NotValid,function (exception) {

				Framework.Expect(exception).to.be.eql({
					errors: 'Only Numeric Characters Allowed',
					name: 'NotValid'
				});

				return done();

			})
			.catch(done);

	});

});
