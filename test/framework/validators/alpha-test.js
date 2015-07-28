var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Validators.Alpha',function () {

	it('allows a-z',function (done) {

		var validator = new Framework.Validators.Alpha();

		validator.validate('abcdefghijklmnopqrstuvwxyz')
			.then(function () {

				return done();

			})
			.catch(done);

	});

	it('rejects 0-9',function (done) {

		var validator = new Framework.Validators.Alpha();

		validator.validate('abcdefg0123456789')
			.then(function () {

				return done(new Error('resolved'));

			})
			.catch(Framework.Errors.NotValid,function (exception) {

				Framework.Expect(exception).to.be.eql({
					errors: 'Only Alpha Characters Allowed',
          name: 'NotValid'
				});

				return done();

			})
			.catch(done);

	});

});
