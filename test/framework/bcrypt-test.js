var base = process.env.PWD;

var Framework = require(+'/framework');

describe('Framework.Bcrypt',function () {

	it('compare should return promise and resolve when password and hash match',function (done) {

		var password = 'test';

		Framework.Bcrypt.hash(password)
			.then(function (hash) {

				return Framework.Bcrypt.compare(password,hash);

			})
			.then(function (result) {

				Framework.Expect(result).to.be.true;

				done();

			})
			.catch(function (exception) {

				console.error(exception);

				done(exception);

			});

	});

	it('compare should return promise and resolve and result should be false when password and hash don\'t match',function (done) {

		var password = 'test';

		Framework.Bcrypt.hash(password)
			.then(function (hash) {

				return Framework.Bcrypt.compare('password',hash);

			})
			.then(function (result) {

				Framework.Expect(result).to.not.be.ok;

				done();

			})
			.catch(done);

	});

});
