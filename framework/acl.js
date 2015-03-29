var Promise = require('./promise');
var NotAllowed = require('./errors').NotAllowed;

function Acl(config) {

	config = config || {};

	this.rules = {};

}

Acl.prototype.addResource = function (resource) {

	if (undefined === this.rules[resource]) {

		this.rules[resource] = [];

	}

	return this;

};

Acl.prototype.allow = function (roles,resources,privileges,assertions) {

	var rule;

	resources = resources || ['*'];

	roles = roles || [];

	privileges = privileges || [];

	assertions = assertions || [];

	if (!Array.isArray(roles)) {

		roles = [roles];

	}

	if (!Array.isArray(resources)) {

		resources = [resources];
	}

	if (!Array.isArray(privileges)) {

		privileges = [privileges];
	}

	if (!Array.isArray(assertions)) {

		assertions = [assertions];

	}

	rule = new AclRule({
		roles: roles,
		privileges: privileges,
		assertions: assertions
	});

	for (var i = 0; i < resources.length; i++) {

		this.addResource(resources[i]);

		this.rules[resources[i]].push(rule);

	}

	return this;

};

Acl.prototype.isAllowed = function isAllowed(user,resource,privilege,context) {

	var acl = this,
		error = new NotAllowed(resource,privilege),
		promise;

	user.roles = user.roles || [];

	if (undefined === this.rules[resource]) {

		console.log('acl no resource',resource);

		return Promise.reject(error);

	}

	if (this.rules['*']) {

		promise = this.tryRules(this.rules['*'],user,resource,privilege,context);

	} else {

		promise = Promise.reject(error);

	}

	return promise
		.catch(NotAllowed,function (error) {

			if (acl.rules[resource]) {

				return acl.tryRules(acl.rules[resource],user,resource,privilege,context);

			} else {

				throw error;

			}

		})
		.then(function () {

			return context;

		});

};

Acl.prototype.tryRules = function tryRules(rules,user,resource,privilege,context) {

	var allowed, promises = new Array(rules.length);

	for (var i = 0; i < rules.length; i++) {

		promises[i] = rules[i].isAllowed(user,resource,privilege,context);

	}

	return Promise.any(promises);

};

function AclRule(config) {

	this.assertions = config.assertions || [];

	this.privileges = config.privileges || [];

	this.roles = config.roles || [];

}

AclRule.prototype.isAllowed = function (user,resource,privilege,context) {

	var match = false;

	if (this.roles.length === 0) {

		match = true;

	} else {

		for (var i = 0; i < user.roles.length; i++) {

			for (var r = 0; r < this.roles.length; r++) {

				if (user.roles[i] === this.roles[r]) {

					match = true;

					break;

				}

			}

			if (match) {

				break;

			}

		}

	}

	if (match) {

		if (this.privileges.length === 0) {

			return Promise.resolve(true);

		}

		match = false;

		for (var i = 0; i < this.privileges.length; i++) {

			if (privilege === this.privileges[i]) {

				match = true;

				break;

			}

		}

		if (match) {

			var promises = new Array(this.assertions.length);

			for (var i = 0; i < this.assertions.length; i++) {

				promises[i] = this.assertions[i](user,resource,privilege,context);

			}

			return Promise.all(promises)
				.then(function () {

					return true;

				},function () {

					throw false;

				});

		} else {

			return Promise.reject(false);

		}

	} else {

		return Promise.reject(false);

	}

};

module.exports = Acl;
