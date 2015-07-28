var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Validators.Exists',function () {

	it('resolves',function (done) {

		var service = {},
			validator,
			mock = new Framework.Mock();

		mock.mock('service',service,'fetchOne')
			.with({
				id: 'abcdefghijklmnopqrstuvwxyz'
			})
			.resolve(true);

		validator = new Framework.Validators.Exists({
			key: 'id',
			service: service
		});

		validator.validate('abcdefghijklmnopqrstuvwxyz')
			.then(function () {

				mock.done(done);

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
			.reject(false);

		validator = new Framework.Validators.Exists({
			key: 'id',
			service: service
		});

		validator.validate('abcdefg0123456789')
			.then(function () {

				done(new Error('rejected'));

			})
			.catch(Framework.Errors.NotValid,function (exception) {

				Framework.Expect(exception).to.be.eql({
					errors: 'Does Not Exist',
					name: 'NotValid'
				});

				return mock.done(done);

			})
			.catch(done);

	});

});
