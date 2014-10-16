var crypto = require('crypto');

var Exceptions = require('./exceptions');
var Promise = require('./promise');
var Set = require('./set');

function Service(config) {
	
	this.acl = config.acl;
	this.adapter = config.adapter;
	this.application = config.application;
	this.forms = config.forms || {};
	this.idLength = config.idLength;
	this.model = config.model;
	
}

Service.prototype.add = function (data,scope) {
	
	return this.adapter.insert(data).then(function (result) {
		
		if (result.affectedRows) {
			
			return true;
			
		} else {
			
			throw false;
			
		}
		
	});
	
};

Service.prototype.createId = function (length) {
	
	length = length || this.idLength;
	
	return crypto.randomBytes(length).toString('hex').substr(0,length);
	
};

Service.prototype.delete = function (model,scope,bypass) {
	
	var promise, service = this;
	
	if (bypass) {
		
		promise = Promise.resolve(true);
		
	} else {
		
		promise = service.acl.isAllowed(model,'delete',scope);
		
	}
	
	return promise.then(function () {
		
		return service.adapter.delete(model.primary()).then(function (result) {
			
			if (result.affectedRows) {
				
				return true;
				
			} else {
				
				throw false;
				
			}
			
		});
		
	});
	
};

Service.prototype.edit = function (data,where,scope) {
	
	return this.adapter.update(data,where).then(function (result) {
		
		if (result.affectedRows) {
			
			return true;
			
		} else {
			
			throw false;
			
		}
		
	});
	
};

Service.prototype.fetchAll = function (where,limit,offset,scope,bypass) {
	
	var promise, service = this;
	
	if ('fetchAll' in this.forms) {
	
		promise = this.forms.fetchAll.validate(where,scope);
	
	} else {
		
		promise = Promise.resolve(where);
		
	}
	
	return promise.then(function (where) {
		
		return service.adapter.fetchAll(where,undefined,offset).then(function (results) {
			
			var promises = [], set = new Set();
			
			set.actualLength = results.length;
			
			limit = limit || results.length;
			
			for (var i = 0, length = results.length; i < length; i++) {
				
				if ((i + 1) < limit) {
					
					var model = new service.model({
							data: results[i],
							service: service
						}),
						promise;
					
					if (bypass) {
						
						promise = Promise.resolve(model);
						
					} else {
						
						promise = service.acl.isAllowed(model,'view',scope);
						
					}
					
					promises.push(promise.then(function (model) {
						
						set.push(model);
						
					}));
					
				}
				
			}
			
			return Promise.settle(promises).then(function () {
				
				return set;
				
			});
			
		});
		
	});
	
};

Service.prototype.fetchNew = function () {

	var model = new this.model({
		new: true,
		service: this
	});
	
	return Promise.resolve(model);
	
};

Service.prototype.fetchOne = function (where,scope,bypass) {
	
	var promise, service = this;
	
	if ('fetchOne' in service.forms) {
		
		promise = service.forms.fetchOne.validate(where,scope);
		
	} else {
		
		promise = Promise.resolve(where);
		
	}
	
	return promise.then(function (where) {
		
		return service.adapter.fetchRow(where,0).then(function (result) {
			
			var model;
			
			if (result) {
				
				model = new service.model({
					data: result,
					service: service
				});
				
				if (bypass) {
					
					return model;
					
				} else {
					
					return service.acl.isAllowed(model,'view',scope);
					
				}
				
			} else {
				
				throw new Exceptions.NotFound();
				
			}
			
		});
		
	});
	
};

Service.prototype.save = function (model,scope,bypass) {
	
	var privileges = model.privileges(),
		promise,
		service = this;
	
	if (model.new) {
		
		privileges.push('add');
		
	} else {
		
		privileges.push('edit');
		
	}
	
	if (bypass) {
		
		promise = Promise.resolve(model);
		
	} else {
		
		promise = service.acl.isAllowed(model,privileges,scope);
		
	}
	
	return promise.then(function () {
		
		var diff = model.diff();
		
		if (model.new) {
			
			promise = service.add(diff,scope);
			
		} else {
			
			promise = service.edit(diff,model.primary(),scope);
			
		}
		
		return promise.then(function () {
			
			return model;
			
		});
		
	});
	
};

Service.prototype.service = function (name) {
	
	return this.application.service(name);
	
};

module.exports = Service;