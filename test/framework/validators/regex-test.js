var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Validators.Regex',function () {

	it('constructor without message',function () {

		var validator = new Framework.Validators.Regex({
			regex: /test/
		});

		Framework.Expect(validator.message).to.be.equal('Does Not Match');

	});

});
