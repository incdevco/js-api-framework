/* istanbul ignore next */
var env = process.env.NODE_ENV || "production";

var AWS = require("../aws");
var Errors = require("../errors");
var Expect = require("../expect");
var Promise = require("../promise");

function Adapter(config) {
	"use strict";

	Expect(config).to.be.an("object","config");

	if (config.s3) {

		Expect(config.s3).to.be.an("object","config.s3");

	}

	this.s3 = config.s3 || new AWS.S3();

}

Adapter.prototype.add = function add(model) {
	"use strict";

	var adapter = this, promise;

};

Adapter.prototype.delete = function _delete(model) {
	"use strict";



};

Adapter.prototype.edit = function edit(oldModel, newModel) {
	"use strict";



};

Adapter.prototype.fetchAll = function fetchAll(where, limit, offset) {
	"use strict";



};

Adapter.prototype.fetchOne = function (where, offset) {
	"use strict";



};

Adapter.prototype.makeRequest = function (params) {
	"use strict";

	return new Promise(function (resolve, reject) {



	});

};

module.exports = Adapter;
