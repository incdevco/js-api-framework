var Promise = require('./promise');
var Exceptions = require('./exceptions');

function Acl(config) {
	
	config = config || {};
	
	this.injector = config.injector;
	this.logger = config.logger;
	this.rules = {};
	
}

Acl.prototype.allow = function (roles,resources,privileges,assertions) {
	
	var rule;
	
	roles = roles || [];
	
	resources = resources || '*';
	
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
	
	for (var i = 0, length = privileges.length; i < length; i++) {
		
		privileges[i] = this.normalizePrivilege(privileges[i]);
		
	}
	
	rule = new AclRule({
		roles: roles,
		privileges: privileges,
		assertions: assertions
	});
	
	for (var i = 0,length = resources.length; i < length; i++) {
		
		if (!(resources[i] in this.rules)) {
		
			this.rules[resources[i]] = [];
		
		}
		
		this.rules[resources[i]].push(rule);
	
	}
	
	return this;
	
};

Acl.prototype.isAllowed = function (resource,privileges,scope) {
	
	var id = resource,
		promises = [];
	
	if (typeof resource == 'object') {
		
		if ('getResourceId' in resource) {
		
			id = resource.getResourceId();
		
		}
		
	}
	
	if (typeof id != 'string') {
		
		return Promise.reject('Resource could not be converted to a string.');
	
	}
	
	if (undefined === typeof(this.rules[id])) {
		
		return Promise.reject(false);
		
	}
	
	if (!Array.isArray(privileges)) {
		
		privileges = [privileges];
		
	}
	
	if (privileges.length === 0) {
		
		return Promise.resolve(resource);
		
	}
	
	privileges = this.normalizePrivilege(privileges);
	
	for (var i = 0, length = privileges.length; i < length; i++) {
		
		//console.log('Acl Trying',id,privileges[i]);
		
		promises.push(this.isAllowedSingle(id,resource,privileges[i],scope).catch(function (exception) {
			
			console.error('Acl',exception,scope.roles);
			
			throw exception;
			
		}));
		
	}
	
	return Promise.all(promises).then(function () {
		
		return resource;
		
	});
	
};

Acl.prototype.isAllowedSingle = function (id,resource,privilege,scope) {
	
	var acl = this, promises = [], promise;
	
	if (undefined === acl.rules['*']) {
		
		promise = Promise.reject(false);
		
	} else {
		
		//console.log('Trying * Rules');
		
		promise = acl.tryRules(acl.rules['*'],resource,privilege,scope);
		
	}
	
	return promise.catch(function () {
		
		if (undefined === acl.rules[id]) {
			
			promise = Promise.reject(false);
			
		} else {
			
			//console.log('Trying '+id+' Rules');
			
			promise = acl.tryRules(acl.rules[id],resource,privilege,scope);
			
		}
		
		return promise.catch(function () {
			
			throw new Exceptions.NotAllowed({
				resource: id,
				privilege: privilege
			});
			
		});
		
	});
	
};

Acl.prototype.normalizePrivilege = function (privilege) {
	
	if (Array.isArray(privilege)) {
		
		var normalized = [];
		
		for (var i = 0, length = privilege.length; i < length; i++) {
			
			normalized.push(this.normalizePrivilege(privilege[i]));
			
		}
		
		return normalized;
	
	} else {
		
		return privilege.toLowerCase();
		
	}
	
};

Acl.prototype.tryRules = function (rules,resource,privilege,scope) {
	
	var promises = [];
	
	for (var i = 0, length = rules.length; i < length; i++) {
		
		//console.log('Acl Trying Rule');
		
		promises.push(rules[i].isAllowed(resource,privilege,scope));
		
	}
	
	return Promise.settle(promises).then(function (results) {
		
		for (var i = 0, length = results.length; i < length; i++) {
			
			//console.log('Acl Trying Result');
			
			if (results[i].isFulfilled()) {
				
				return true;
				
			}
			
		}
		
		throw false;
		
	});
	
};

function AclRule(config) {
	
	this.assertions = config.assertions || [];
	
	this.privileges = config.privileges || [];
	
	this.roles = config.roles || [];
	
}

AclRule.prototype.isAllowed = function (resource,privilege,scope) {
	
	scope = scope || {};
	
	roles = scope.roles || [];
	
	if (!Array.isArray(roles)) {
		
		roles = [roles];
		
	}
	
	var match = false;
	
	if (this.roles.length === 0) {
		
		match = true;
		
	} else {
		
		for (var i = 0,length = roles.length; i < length; i++) {
			
			for (var r = 0, rlength = this.roles.length; r < rlength; r++) {
				
				//console.log('Role Match',roles[i],this.roles[r]);
				
				if (roles[i] === this.roles[r]) {
				
					match = true;
				
				}	
			
			}
			
		}
		
	}
	
	if (match) {
		
		//console.log('AclRule.isAllowed','Match');
		
		if (this.privileges.length === 0) {
			
			//console.log('AclRule.isAllowed','No Privileges');
			
			return Promise.resolve(true);
			
		}
		
		match = false;
		
		for (var i = 0, length = this.privileges.length; i < length; i++) {
			
			//console.log('AclRule Privilege Match',privilege,this.privileges[i]);
			
			if (privilege == this.privileges[i]) {
			
				match = true;
			
			}
		
		}
		
		if (match) {
			
			var promises = [];
			
			for (var i = 0, length = this.assertions.length; i < length; i++) {
				
				promises.push(this.assertions[i].assert(resource,privilege,scope));
				
			}
			
			return Promise.all(promises).then(function () {
				
				return true;
				
			}).catch(function (exception) {
				
				console.log('AclRule','Assertion Failed',exception,exception.stack);
				
				throw false;
			
			});
			
		} else {
			
			//console.log('AclRule.isAllowed','No Match Privilege',this.privileges,privilege);
			
			return Promise.reject(false);
		
		}
		
	} else {
		
		//console.log('AclRule.isAllowed','No Match Role',this.roles,roles);
		
		return Promise.reject(false);
		
	}
	
};

module.exports = Acl;