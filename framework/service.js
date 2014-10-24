var Exceptions = require('./exceptions');
var Adapters = require('./adapters');
var Form = require('./form');
var Promise = require('./promise');

function Service(config) {
	
	var service = this;
	
	config = config || {};
	
	this.acl = config.acl || null;
	this.adapter = null;
	this.forms = {};
	this.resource = config.resource || null;
	
	this.adapter = config.adapter;
	
	if (config.forms) {
		
		Object.keys(config.forms).forEach(function (name) {
			
			service.form(name,config.forms[name]);
			
		});
		
	}
	
}

Service.prototype.allowed = function (scope,model) {
	
	var allowed = {}, promises = [], acl = this.acl, resource = this.resource;
	
	Object.keys(model).forEach(function (attribute) {
		
		promises.push(acl.isAllowed(scope,resource,'get::'+attribute,model).then(function () {
			
			allowed[attribute] = model[attribute];
			
			return true;
			
		}).catch(function () {
			
			return true;
			
		}));
		
	});
	
	return Promise.all(promises).then(function () {
		
		return allowed;
		
	});
	
};

Service.prototype.delete = function (scope,model) {
	
	var promise, service = this;
	
	if (service.forms.delete) {
		
		promise = service.forms.delete.validate(scope,model);
		
	} else {
		
		promise = Promise.resolve(model);
		
	}
	
	return promise.then(function (clean) {
		
		return service.acl.isAllowed(scope,service.resourceId,'delete',clean).then(function (clean) {
			
			return service.adapter.delete(clean);
			
		});
		
	});
	
};

Service.prototype.fetchAll = function (scope,where,limit,offset) {
	
	var promise, service = this;
	
	if (service.forms.fetchAll) {
		
		promise = service.forms.fetchAll.validate(scope,where);
		
	} else {
		
		promise = Promise.resolve(where);
		
	}
	
	return promise.then(function (clean) {
		
		if (limit) {
			
			limit = parseInt(limit);
			
		}
		
		if (offset) {
			
			offset = parseInt(offset);
			
		}
		
		return service.adapter.fetch(clean,undefined,offset).then(function (original) {
			
			var promises = [], set = [];
			
			if (undefined === limit) {
				
				limit = original.length;
				
			}
			
			for (var i = 0; i < limit; i ++) {
				
				promises.push(service.acl.isAllowed(scope,service.resourceId,'view',original[i]).then(function (model) {
					
					set.push(model);
					
					return true;
					
				}).catch(function () {
					
					return false;
					
				}));
				
			}
			
			return Promise.all(promises).then(function () {
				
				return set;
				
			});
			
		});
		
	});
	
};

Service.prototype.fetchNew = function () {

	return {};
	
};

Service.prototype.fetchOne = function (scope,where,offset) {
	
	var promise, service = this;
	
	if (service.forms.fetchOne) {
		
		promise = service.forms.fetchOne.validate(scope,where);
		
	} else {
		
		promise = Promise.resolve(where);
		
	}
	
	return promise.then(function (clean) {
		
		limit = 1;
		
		if (offset) {
			
			offset = parseInt(offset);
			
		}
		
		return service.adapter.fetch(clean,limit,offset).then(function (model) {
			
			return service.acl.isAllowed(scope,service.resourceId,'view',model).then(function (model) {
				
				return model;
				
			});
			
		});
		
	});
	
};

Service.prototype.form = function (name,form) {
	
	if (form) {
		
		this.forms[name] = form;
		
		return this;
		
	} else {
		
		return this.forms[name];
		
	}
	
};

Service.prototype.insert = function (scope,model) {
	
	var promise, service = this;
	
	if (service.forms.insert) {
		
		promise = service.forms.insert.validate(scope,model);
		
	} else {
		
		promise = Promise.resolve(model);
		
	}
	
	return promise.then(function (clean) {
		
		var keys = Object.keys(clean), privileges = ['insert'];
		
		keys.forEach(function (key) {
			
			privileges.push('set::'+key);
			
		});
		
		return service.acl.isAllowedMultiple(scope,service.resourceId,privileges,clean).then(function (clean) {
			
			return service.adapter.insert(clean).then(function (clean) {
				
				return clean;
				
			});
			
		});
		
	});
	
};

Service.prototype.toJson = function (scope,model) {
	
	var promise, promises = [], service = this;
	
	if (Array.isArray(model)) {
		
		var set = [];
		
		model.forEach(function (model) {
			
			promises.push(service.allowed(scope,model).then(function (allowed) {
				
				set.push(allowed);
				
				return true;
				
			}));
			
		});
		
		promise = Promise.all(promises).then(function () {
			
			return set;
			
		});
		
	} else {
		
		promise = service.allowed(scope,model);
		
	}
	
	return promise.then(function (allowed) {
		
		return JSON.stringify(allowed);
		
	});
	
};

Service.prototype.update = function (scope,model) {
	
	var promise, service = this;
	
	if (service.forms.update) {
		
		promise = service.forms.update.validate(scope,model);
		
	} else {
		
		promise = Promise.resolve(model);
		
	}
	
	return promise.then(function (clean) {
		
		var keys = Object.keys(clean), privileges = ['update'];
		
		keys.forEach(function (key) {
			
			privileges.push('set::'+key);
			
		});
		
		return service.acl.isAllowedMultiple(scope,service.resourceId,privileges,clean).then(function (clean) {
			
			return service.adapter.update(clean).then(function (clean) {
				
				return clean;
				
			});
			
		});
		
	});
	
};

module.exports = Service;