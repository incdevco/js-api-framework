var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Validators.NotExists',function () {

	it('resolves',function (done) {

		var service = {},
			validator,
			mock = new Framework.Mock();

		mock.mock('service',service,'fetchOne')
			.with({
				id: 'abcdefghijklmnopqrstuvwxyz'
			})
			.reject(false);

		validator = new Framework.Validators.NotExists({
			key: 'id',
			service: service
		});

		validator.validate('abcdefghijklmnopqrstuvwxyz')
			.then(function () {

				return mock.done(done);

			})
			.catch(done);

	});

	it('rejects',function (done) {

		var service = {},
			validator,
			mock = new Framework.Mock();

		mock.mock('service',service,'fetchOne')
			.with({
				id: 'abcdefg0123456789'
			})
			.resolve(true);

		validator = new Framework.Validators.NotExists({
			key: 'id',
			service: service
		});

		validator.validate('abcdefg0123456789')
			.then(function () {

				return done(new Error('resolved'));

			})
			.catch(Framework.Errors.NotValid,function (exception) {

				Framework.Expect(exception).to.be.eql({
					errors: 'Already Exists'
				});

				return mock.done(done);

			})
			.catch(done);

	});

});
