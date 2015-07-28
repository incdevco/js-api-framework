var util = require("util");

var Expect = require("./expect");
var Promise = require("./promise");

function Mock() {
	"use strict";

	this.mocks = {};

}

Mock.prototype.done = function done(done) {
	"use strict";

	var mock = this,
		keys = Object.keys(this.mocks);

	keys.forEach(function (key) {

		var fns = Object.keys(mock.mocks[key]);

		fns.forEach(function (fn) {

			var mocked = mock.mocks[key][fn];

			if (mocked.calls.length !== mocked.called) {

				console.error("expected", mocked.calls.length);

				console.error("actual", mocked.called);

				throw new Error(mocked.name + "#" + mocked.fn + " called count does not match");

			}

		});

	});

	return done();

};

Mock.prototype.mock = function mock(name, obj, fn) {
	"use strict";

	var mocked;

	if (undefined === this.mocks[name]) {

		this.mocks[name] = {};

	}

	if (undefined === this.mocks[name][fn]) {

		this.mocks[name][fn] = new Mocked({
			name: name,
			fn: fn
		});

	}

	mocked = this.mocks[name][fn];

	obj[fn] = function () {

		return mocked.mocked.apply(mocked, arguments);

	};

	return mocked.next();

};

function Mocked(config) {
	"use strict";

	this.called = 0;
	this.calls = [];
	this.fn = config.fn;
	this.name = config.name;

}

Mocked.prototype.call = function call(index) {
	"use strict";

	return this.calls[index];

};

Mocked.prototype.mocked = function mocked() {
	"use strict";

	var index;

	this.called++;

	index = this.called - 1;

	if (undefined === this.calls[index]) {

		throw new Error(this.name+ "." + this.fn + " not expected to be called " + this.called + " times");

	}

	return this.calls[index].call.apply(this.calls[index], arguments);

};

Mocked.prototype.next = function next() {
	"use strict";

	var call = new MockedCall({
		name: this.name,
		fn: this.fn
	});

	this.calls.push(call);

	return call;

};

function MockedCall(config) {
	"use strict";

	this.name = config.name;
	this.fn = config.fn;

	this._callback = config.callback;
	this._reject = config.reject;
	this._resolve = config.resolve;
	this._return = config.return;
	this._with = config.with;

}

MockedCall.prototype.call = function _call() {
	"use strict";

	var args = arguments, mocked = this;

	if (this._with) {

		Object.keys(this._with).forEach(function (index) {

			try {

				if (typeof mocked._with[index] === "object") {

					Expect(args[index]).to.be.eql(mocked._with[index]);

				} else {

					Expect(args[index]).to.be.equal(mocked._with[index]);

				}

			} catch (error) {

				throw error;

				//throw new Error(mocked.name + "." + mocked.fn + " " + error.message);

			}

		});

	}

	if (undefined !== this._resolve) {

		return Promise.resolve(this._resolve);

	} else if (undefined !== this._reject) {

		return Promise.reject(this._reject);

	} else if (undefined !== this._callback) {

		return arguments[arguments.length - 1].apply(undefined,this._callback);

	} else if (undefined !== this._return) {

		return this._return;

	} else {

		return null;

	}

};

MockedCall.prototype.callback = function callback() {

	this._callback = arguments;

	return this;

};

MockedCall.prototype.reject = function reject(reject) {

	this._reject = reject;

	return this;

};

MockedCall.prototype.resolve = function resolve(resolve) {

	this._resolve = resolve;

	return this;

};

MockedCall.prototype.return = function _return(_return) {

	this._return = _return;

	return this;

};

MockedCall.prototype.with = function _with() {

	this._with = arguments;

	return this;

};

module.exports = Mock;
