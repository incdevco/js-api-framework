var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Validators.Url',function () {

	it('allows',function (done) {

		var validator = new Framework.Validators.Url();

		validator.validate('http://google.com',{})
			.then(function () {

				return done();

			})
			.catch(done);

	});

	it('rejects',function (done) {

		var validator = new Framework.Validators.Url();

		validator.validate('abcdefg')
			.then(function () {

				return done(new Error('resolved'));

			})
			.catch(Framework.Errors.NotValid,function (exception) {

					Framework.Expect(exception).to.be.eql({
						errors: 'Not A Valid Url',
						name: 'NotValid'
					});

					return done();

			})
			.catch(done);

	});

});
