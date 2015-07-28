var AWS = require("../../aws");
var Expect = require("../../expect");
var Promise = require("../../promise");

function Adapter(config) {
	"use strict";

	Expect(config).to.be.an("object", "config");

	if (config.acl) {

		Expect(config.acl).to.be.a("string", "config.acl");

	}

	Expect(config.bucket).to.be.a("string", "config.bucket");

	if (config.prefix) {

		Expect(config.prefix).to.be.a("string", "config.prefix");

	}

	if (config.s3) {

		Expect(config.s3).to.be.an("object", "config.s3");

	}

	this.acl = config.acl || "private";
	this.bucket = config.bucket;
	this.prefix = config.prefix;
	this.s3 = config.s3 || new AWS.S3();

}

Adapter.prototype.add = function add(model) {
	"use strict";

	var adapter = this;

	return new Promise(function (resolve, reject) {

		return adapter.s3.putObject({
			Acl: adapter.acl,
			Body: JSON.stringify(model),
			Bucket: adapter.bucket,
			Key: adapter.createModelKey(model)
		}, function (error) {

			if (error) {

				return reject(error);

			} else {

				return resolve(model);

			}

		});

	});

};

Adapter.prototype.createModelKey = function createModelKey(model) {
	"use strict";

	return "" + this.prefix + "/" + model.id;

};

Adapter.prototype.delete = function _delete(model) {
	"use strict";

	var adapter = this;

	return new Promise(function (resolve, reject) {

		return adapter.s3.deleteObject({
			Acl: adapter.acl,
			Bucket: adapter.bucket,
			Key: adapter.createModelKey(model)
		}, function (error) {

			if (error) {

				return reject(error);

			} else {

				return resolve(model);

			}

		});

	});

};

Adapter.prototype.edit = function edit(model) {
	"use strict";

	var adapter = this;

	return new Promise(function (resolve, reject) {

		return adapter.s3.putObject({
			Acl: adapter.acl,
			Body: JSON.stringify(model),
			Bucket: adapter.bucket,
			Key: adapter.createModelKey(model)
		}, function (error) {

			if (error) {

				return reject(error);

			} else {

				return resolve(model);

			}

		});

	});

};

Adapter.prototype.fetchAll = function fetchAll() {
	"use strict";

	return new Promise(function (resolve) {

		return resolve([]);

	});

};

Adapter.prototype.fetchOne = function (where) {
	"use strict";

	var adapter = this;

	return new Promise(function (resolve, reject) {

		return adapter.s3.getObject({
			Bucket: adapter.bucket,
			Key: adapter.createModelKey(where)
		}, function (error, data) {

			if (error) {

				return reject(error);

			} else {

				return resolve(JSON.stringify(data.Body));

			}

		});

	});

};

module.exports = Adapter;
