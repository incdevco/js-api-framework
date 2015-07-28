var base = process.env.PWD;

var Framework = require( + "/framework");

describe("Framework.Mock", function () {

	it("mocked function not called enough times", function (done) {

		var test = {}, mock = new Framework.Mock();

		mock.mock("test", test, "test")
			.return(true);

		try {

			mock.done();

		} catch (error) {

			Framework.Expect(error.message).to.be.equal("test#test called count does not match");

			done();

		}

	});

	it("call", function () {

		var test = {}, mock = new Framework.Mock();

		mock.mock("test", test, "test")
			.return(true);

		Framework.Expect(mock.mocks.test.test.call(0)).to.be.ok();

	});

	it("mocked function not called to many times", function (done) {

		var test = {}, mock = new Framework.Mock();

		mock.mock("test", test, "test");


		try {

			test.test();

			test.test();

			mock.done(done);

		} catch (error) {

			Framework.Expect(error.message).to.be.equal("test.test not expected to be called 2 times");

			done();

		}

	});

	it("mocked function not called with correct arguments", function (done) {

		var test = {}, mock = new Framework.Mock();

		mock.mock("test", test, "test")
			.with("test")
			.return(true);

		try {

			test.test("dog");

			mock.done(done);

		} catch (error) {

			Framework.Expect(error.message).to.be.equal("Expected test.test With: 'test' Actual: 'dog'");

			done();

		}

	});

});
