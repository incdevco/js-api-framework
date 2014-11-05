var Exceptions = require('./exceptions');
var Adapters = require('./adapters');
var Form = require('./form');
var Promise = require('./promise');

function Service(config) {
	
	var service = this;
	
	config = config || {};
	
	this.acl = config.acl || null;
	this._adapter = null;
	this.forms = {};
	this._primary = null;
	this.resource = config.resource || null;
	
	if (config.adapter) {
		
		service.adapter(config.adapter);
		
	}
	
	if (config.forms) {
		
		Object.keys(config.forms).forEach(function (name) {
			
			service.form(name,config.forms[name]);
			
		});
		
	}
	
	if (config.primary) {
		
		if (!Array.isArray(config.primary)) {
			
			config.primary = [config.primary];
			
		}
		
		this._primary = config.primary;
		
	}
	
}

Service.prototype.adapter = function adapter(adapter) {
	
	if (adapter) {
		
		if ('function' === typeof adapter) {
			
			adapter = adapter();
			
		}
		
		this._adapter = adapter;
		
		return this;
		
	} else {
		
		return this._adapter;
		
	}
	
};

Service.prototype.add = function add(scope,data) {
	
	var service = this;
	
	return service.isValid('add',scope,data)
		.then(function (clean) {
			
			return service.isAllowed(scope,clean,'add','set');
			
		})
		.then(function (clean) {
			
			return service.adapter().add(clean);
			
		});
	
};

Service.prototype.allowed = function allowed(scope,original,privilege) {
	
	var acl = this.acl, 
		allowed = {}, 
		promises = [], 
		resource = this.resource;
	
	Object.keys(original).forEach(function (key) {
		
		promises.push(acl.isAllowed(scope,resource,privilege+'::'+key,original)
			.then(function () {
				
				allowed[key] = original[key];
				
				return true;
				
			})
			.catch(Exceptions.NotAllowed,function () {
				
				return true;
				
			}));
		
	});
	
	return Promise.all(promises).then(function done() {
		
		return allowed;
		
	});
	
};

Service.prototype._bootstrap = function bootstrap(application) {
	
	this.adapter()._bootstrap(application);
	
	if ('function' === typeof this.adapter().bootstrap) {
		
		this.adapter().bootstrap(application);
		
	}
	
};

Service.prototype.delete = function (scope,data) {
	
	var service = this;
	
	return service.fetchOne(scope,data)
		.then(function (model) {
			
			return service.isAllowed(scope,model,'delete');
			
		})
		.then(function (clean) {
			
			return service.adapter().delete(service.primary(clean));
			
		});
	
};

Service.prototype.edit = function edit(scope,data) {
	
	var service = this;
	
	return service.fetchOne(scope,data)
		.then(function (model) {
			
			return service.isValid('edit',scope,data);
			
		})
		.then(function (clean) {
			
			return service.isAllowed(scope,clean,'edit','set');
			
		})
		.then(function (clean) {
			
			return service.adapter().edit(clean);
			
		});
	
};

Service.prototype.fetchAll = function fetchAll(scope,where,limit,offset) {
	
	var service = this;
	
	return service.isValid('fetchAll',scope,where)
		.then(function (clean) {
			
			return service.adapter().fetch(clean,limit,offset);
			
		})
		.then(function found(set) {
			
			return service.isAllowed(scope,set,'view','get');
			
		});
	
};

Service.prototype.fetchOne = function fetchOne(scope,where,offset) {
	
	var service = this;
	
	return service.isValid('fetchOne',scope,where)
		.then(function (clean) {
			
			return service.adapter().fetch(clean,offset,1);
			
		})
		.then(function (results) {
			
			if (results.length === 0) {
				
				throw new Exceptions.NotFound();
				
			}
			
			return service.isAllowed(scope,results[0],'view','get');
			
		});
	
};

Service.prototype.form = function form(name,form) {
	
	if (form) {
		
		if ('function' === typeof form) {
			
			form = form();
			
		}
		
		this.forms[name] = form;
		
		return this;
		
	} else {
		
		return this.forms[name];
		
	}
	
};

Service.prototype.isAllowed = function isAllowed(scope,original,privilege,attribute) {
	
	var service = this;
	
	if (Array.isArray(original)) {
		
		var allowed = [], promises = [];
		
		original.forEach(function (model) {
			
			promises.push(service.isAllowed(scope,model,privilege,attribute)
				.then(function (model) {
					
					allowed.push(model);
					
					return true;
					
				})
				.catch(Exceptions.NotAllowed,function () {
					
					return true;
					
				}));
			
		});
		
		return Promise.all(promises).then(function () {
			
			return allowed;
			
		});
		
	} else {
		
		return service.acl.isAllowed(scope,service.resource,privilege,original)
			.then(function (original) {
				
				if (attribute) {
				
					return service.allowed(scope,original,attribute);
				
				} else {
					
					return original;
					
				}
				
			});
		
	}
	
};

Service.prototype.isValid = function isValid(form,scope,data) {
	
	if (this.forms[form]) {
		
		return this.forms[form].validate(scope,data);
		
	} else {
		
		return Promise.resolve(data);
		
	}
	
};

Service.prototype.primary = function primary(data) {
	
	var primary = {};
	
	this._primary.forEach(function (key) {
		
		primary[key] = data[key];
		
	});
	
	return primary;
	
};

module.exports = Service;