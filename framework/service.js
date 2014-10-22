var Exceptions = require('./exceptions');
var Adapters = require('./adapter');
var Promise = require('./promise');

function Service(config) {
	
	if (config.adapter === 'mysql') {
		
		this.adapter = new Adapters.Mysql({
			attributes: config.attributes,
			idLength: config.idLength,
			primary: config.primary,
			table: config.table
		});
		
	} else {
		
		throw new Error('Only mysql adapter implemented');
		
	}
	
	this.acl = config.acl;
	this.attributes = config.attributes;
	this.forms = config.forms || {};
	this.idLength = config.idLength;
	this.primary = config.primary;
	this.resourceId = config.resourceId;
	this.table = config.table;
	
}

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
	
	var promises = [], service = this;
	
	if (Array.isArray(model)) {
		
		var string = '';
		
		model.forEach(function (model) {
			
			promises.push(service.toJson(scope,model).then(function (json) {
				
				string += json+',';
				
				return true;
				
			}));
			
		});
		
		return Promise.all(promises).then(function () {
			
			return '['+string.replace(/,$/,'')+']';
			
		});
		
	} else {
		
		var clean = {}, keys = Object.keys(model);
		
		keys.forEach(function (key) {
			
			promises.push(service.acl.isAllowed(scope,service.resourceId,'get::'+key,model).then(function () {
				
				clean[key] = model[key];
				
				return true;
				
			}).catch(function () {
				
				return true;
				
			}));
			
		});
		
		return Promise.all(promises).then(function () {
			
			return JSON.stringify(clean);
			
		});
		
	}
	
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