var base = process.env.PWD;

var Framework = require(base + "/framework");

describe("Framework.Acl", function () {
	"use strict";

	it("acl.allow", function (done) {

		var acl = new Framework.Acl(),
			context = {id: "test"},
			user = {role: ["test"]};

		acl.allow("test", "test", "test");

		acl.allow(["test"], ["test"], ["save"]);

		acl.isAllowed(user, "test", "test", context)
			.then(function (result) {

				try {

					Framework.Expect(result).to.be.eql(context);

					return done();

				} catch (error) {

					return done(error);

				}

			})
			.catch(done);

	});

	it("acl.allow with assertion function", function (done) {

		var acl = new Framework.Acl(),
			context = {id: "test"},
			user = {role: ["test"]};

		acl.allow("test", "test", "test", function () {

			return function () {

				return true;

			};

		});

		acl.isAllowed(user, "test", "test", context)
			.then(function (result) {

				try {

					Framework.Expect(result).to.be.eql(context);

					return done();

				} catch (error) {

					return done(error);

				}

			})
			.catch(done);

	});

	it("acl.allow with assertion throws error", function (done) {

		var acl = new Framework.Acl();

		try {

			acl.allow("test", "test", "test", [
				function () {

					return true;

				},
				"test"
			]);

			return done(new Error("Accepted String Assertion"));

		} catch (error) {

			return done();

		}

	});

	it("acl.allow without assertion not array", function (done) {

		var acl = new Framework.Acl(),
			context = {id: "test"},
			user = {role: ["test"]};

		acl.allow("test", "test", "test", function () {

			return function () {

				return true;

			};

		});

		acl.isAllowed(user, "test", "test", context)
			.then(function (result) {

				try {

					Framework.Expect(result).to.be.eql(context);

					return done();

				} catch (error) {

					return done(error);

				}

			})
			.catch(done);

	});

	it("acl.allow without resource or privilege", function (done) {

		var acl = new Framework.Acl(),
			context = {id: "test"},
			user = {role: ["test"]};

		acl.addResource("test");

		acl.allow("test");

		acl.isAllowed(user, "test", "test", context)
			.then(function (result) {

				try {

					Framework.Expect(result).to.be.eql(context);

					return done();

				} catch (error) {

					return done(error);

				}

			})
			.catch(done);

	});

	it("acl.isAllowed rejects without resource", function (done) {

		var acl = new Framework.Acl(),
			context = {id: "test"},
			user = {role: ["test"]};

		acl.allow("test");

		acl.isAllowed(user, "test", "test", context)
			.then(function () {

				return done(new Error("resolved"));

			})
			.catch(Framework.Errors.NotAllowed, function () {

				done();

			})
			.catch(done);

	});

	it("acl.isAllowed rejects", function (done) {

		var acl = new Framework.Acl(),
			context = {id: "test"},
			user = {};

		acl.allow("test", "test");

		acl.isAllowed(user, "test", "test", context)
			.then(function () {

				return done(new Error("resolved"));

			})
			.catch(Framework.Errors.NotAllowed, function () {

				return done();

			})
			.catch(done);

	});

	it("acl.isAllowed resolves with assertion", function (done) {

		var acl = new Framework.Acl(),
			context = {id: "test"},
			user = {role: ["test"]};

		acl.allow("test", "test", "test", function () {

			return Framework.Promise.resolve(true);

		});

		acl.isAllowed(user, "test", "test", context)
			.then(function () {

				return done();

			})
			.catch(done);

	});

	it("acl.isAllowed rejects with assertion", function (done) {

		var acl = new Framework.Acl(),
			context = {id: "test"},
			user = {roles: ["test"]};

		acl.allow("test", "test", "test", function () {

			return Framework.Promise.reject(false);

		});

		acl.isAllowed(user, "test", "test", context)
			.then(function () {

				return done(new Error("resolved"));

			})
			.catch(Framework.Errors.NotAllowed, function () {

				return done();

			})
			.catch(done);

	});

	it("acl.isAllowed resolves without roles", function (done) {

		var acl = new Framework.Acl(),
			context = {id: "test"},
			user = {roles: ["test"]};

		acl.allow(null, "test", "test");

		acl.isAllowed(user, "test", "test", context)
			.then(function () {

				return done();

			})
			.catch(done);

	});

	it("acl.isAllowed resolves with multiple roles", function (done) {

		var acl = new Framework.Acl(),
			context = {id: "test"},
			user = {roles: ["cat", "dog"]};

		acl.allow(["test", "dog"], "test", "test", function () {

			return Framework.Promise.reject(false);

		});

		acl.isAllowed(user, "test", "test", context)
			.then(function () {

				return done(new Error("resolved"));

			})
			.catch(Framework.Errors.NotAllowed, function () {

				return done();

			})
			.catch(done);

	});

	it("addResource", function () {

		var acl = new Framework.Acl();

		acl.addResource("test");

		acl.addResource("test");

		Framework.Expect(acl.rules.test).to.be.eql([]);

	});

});
