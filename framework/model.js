var Promise = require('./promise');
var Exception = require('./exception');
var Exceptions = require('./exceptions');

function Model(config) {
	
	this.attributes = config.attributes || {};
	this._deleted = false;
	this._modified = {};
	this.new = false;
	this._original = config.data || {};
	this._primary = config.primary || [];
	this._privileges = [];
	this._resourceId = config.resourceId;
	this.service = config.service;
	
	if (config.new) {
		
		this.new = true;
		
		for (var i in this.attributes) {
			
			if (undefined !== this.attributes[i].default) {
				
				this._modified[i] = this.attributes[i].default;
				
			}
			
		}
		
	}
	
}

Model.prototype.delete = function (scope,bypass) {
	
	var model = this;
	
	return this.service.delete(model,scope,bypass).then(function (result) {
		
		return model.deleted();
		
	});
	
};

Model.prototype.deleted = function () {
	
	this._deleted = true;
	
	return this;
	
};

Model.prototype.diff = function () {
	
	var diff = {};
	
	for (var i in this._modified) {
		
		if (this._modified[i] != this._original[i]) {
			
			diff[i] = this._modified[i];
			
		}
		
	}
	
	return diff;
	
};

Model.prototype.get = function (attribute) {
	
	var value = this._modified[attribute];
	
	if (undefined === value) {
		
		value = this._original[attribute];
		
	}
	
	return value;
	
};

Model.prototype.getResourceId = function () {
	
	return this._resourceId;
	
};

Model.prototype.isDiff = function () {
	
	var diff = this.diff();
	
	for (var attribute in diff) {
		
		if (diff.hasOwnProperty(attribute)) {
			
			return true;
			
		}
		
	}
	
	return false;
	
};

Model.prototype.modified = function (attribute) {
	
	return this._modified[attribute];
	
};

Model.prototype.original = function (attribute) {
	
	return this._original[attribute];
	
};

Model.prototype.primary = function () {
	
	var model = this, data = {};
	
	for (var i in model._primary) {
		
		data[model._primary[i]] = model.get(model._primary[i]);
		
	}
	
	return data;
	
};

Model.prototype.privileges = function () {
	
	return this._privileges;
	
};

Model.prototype.save = function (data,scope,bypass) {
	
	var model = this;
	
	if (data) {
		
		model.set(data);
		
	}
		
	if (model.isDiff()) {
		
		return model.validate(scope).then(function (model) {
			
			return model.service.save(model,scope,bypass).then(function () {
				
				return model.saved();
				
			});
			
		});
		
	} else {
		
		return Promise.resolve(model);
		
	}
	
};

Model.prototype.saved = function () {
	
	for (var i in this._modified) {
		
		this._original[i] = this._modified[i];
		
	}
	
	this._modified = [];
	this._requiredPrivileges = [];
	
	return this;
	
};

Model.prototype.set = function (attribute,value,bypass) {
	
	var model = this;
	
	if (typeof(attribute) == 'object') {
		
		for (var i in attribute) {
			
			model.set(i,attribute[i]);
		}
		
	} else {
		
		if (model.attributes.hasOwnProperty(attribute)
			&& model._original[attribute] !== value) {
				
			model._modified[attribute] = value;
			
			if (!bypass) {
			
				model._privileges.push(attribute+'::set');
			
			}
			
		}
		
	}
	
	return model;
	
};

Model.prototype.toData = function (scope,bypass) {
	
	var acl = this.service.acl, data = {}, model = this;
	
	console.log('Model.toData',bypass);
	
	for (var i in model.attributes) {
		
		(function (i) {
			
			if (bypass) {
				
				data[i] = model.get(i);
				
			} else {
				
				data[i] = acl.isAllowed(model,i+'::get',scope).then(function () {
					
					return model.get(i);
					
				}).catch(function () {
					
					return undefined;
					
				});
				
			}
			
		})(i);
		
	}
	
	return Promise.props(data);
	
};

Model.prototype.toJson = function (scope) {
	
	console.log('Model.toJson');
	
	return this.toData(scope).then(function (data) {
		
		return JSON.stringify(data);
		
	});
	
};

Model.prototype.validate = function (scope) {
	
	var messages = {}, model = this, promises = [];
	
	console.log('Model.validate');
	
	return this.toData(scope,true).then(function (data) {
		
		console.log('Model.validate toData', data);
		
		for (var i in model.attributes) {
			
			(function (i) {
				
				promises.push(model.attributes[i].validate(data[i],data,scope)
				.catch(function (exception) {
					
					console.log('Model.validate',i,exception,data[i]);
					
					messages[i] = exception;
					
					throw exception;
					
				}));
				
			})(i);
			
		}
		
		return Promise.all(promises).then(function () {
			
			return model;
			
		}).catch(function (exception) {
			
			throw new Exceptions.NotValid({
				content: JSON.stringify({
					resource: model.getResourceId(),
					errors: messages
				})
			});
			
		});
		
	});
	
};

module.exports = Model;