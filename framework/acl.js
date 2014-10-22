var Promise = require('./promise');
var Exceptions = require('./exceptions');

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
	
	privileges = this.normalizePrivilege(privileges);
	
	rule = new AclRule({
		roles: roles,
		privileges: privileges,
		assertions: assertions
	});
	
	for (var i = 0,length = resources.length; i < length; i++) {
		
		if (undefined === this.rules[resources[i]]) {
		
			this.rules[resources[i]] = [];
		
		}
		
		this.rules[resources[i]].push(rule);
	
	}
	
	return this;
	
};

Acl.prototype.isAllowed = function (scope,resource,privilege,context) {
	
	var acl = this, promise;
	
	if (undefined === this.rules[resource]) {
		
		return Promise.reject(false);
		
	}
	
	privilege = this.normalizePrivilege(privilege);
	
	if (undefined === acl.rules['*']) {
		
		promise = Promise.reject(false);
		
	} else {
		
		promise = acl.tryRules(acl.rules['*'],scope,resource,privilege,context);
		
	}
	
	return promise.then(function () {
		
		return context;
		
	}).catch(function (exception) {
		
		//console.error('*',exception,exception.stack);
		
		return acl.tryRules(acl.rules[resource],scope,resource,privilege,context).then(function (result) {
			
			return context;
			
		}).catch(function (exception) {
			
			//console.error(exception,exception.stack);
			
			throw false;
			
		});
		
	});
	
};

Acl.prototype.isAllowedMultiple = function (scope,resource,privileges,context) {
	
	var acl = this, promises = [];
	
	privileges.forEach(function (privilege) {
		
		promises.push(acl.isAllowed(scope,resource,privilege,context));
		
	});
	
	return Promise.all(promises).then(function () {
		
		return context;
		
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

Acl.prototype.tryRules = function (rules,scope,resource,privilege,context) {
	
	var promises = [];
	
	for (var i = 0, length = rules.length; i < length; i++) {
		
		//console.log('Acl Trying Rule');
		
		promises.push(rules[i].isAllowed(scope,resource,privilege,context));
		
	}
	
	return Promise.any(promises);
	
};

function AclRule(config) {
	
	this.assertions = config.assertions || [];
	
	this.privileges = config.privileges || [];
	
	this.roles = config.roles || [];
	
}

AclRule.prototype.isAllowed = function (scope,id,privilege,context) {
	
	var match = false;
	
	roles = scope.roles;
	
	if (this.roles.length === 0) {
		
		match = true;
		
	} else {
		
		for (var i = 0,length = roles.length; i < length; i++) {
			
			for (var r = 0, rlength = this.roles.length; r < rlength; r++) {
				
				//console.log('Role Match',roles[i],this.roles[r]);
				
				if (roles[i] === this.roles[r]) {
				
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
		
		//console.log('AclRule.isAllowed','Match');
		
		if (this.privileges.length === 0) {
			
			//console.log('AclRule.isAllowed','No Privileges');
			
			return Promise.resolve(true);
			
		}
		
		match = false;
		
		for (var i = 0, length = this.privileges.length; i < length; i++) {
			
			//console.log('AclRule Privilege Match',privilege,this.privileges[i]);
			
			if (privilege === this.privileges[i]) {
			
				match = true;
				
				break;
			
			}
		
		}
		
		if (match) {
			
			var promises = [];
			
			for (var i = 0, length = this.assertions.length; i < length; i++) {
				
				promises.push(this.assertions[i](scope,id,privilege,context));
				
			}
			
			return Promise.all(promises).then(function () {
				
				return true;
				
			}).catch(function (exception) {
				
				//console.log('AclRule','Assertion Failed',exception,exception.stack);
				
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