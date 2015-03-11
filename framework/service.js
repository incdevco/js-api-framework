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
	this._cacheId = config.cacheId;
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

Service.prototype.add = function add(scope,data,bypass) {

	var service = this;

	return service.isValid('add',scope,data)
		.then(function (clean) {

			if (bypass) {

				return clean;

			}

			return service.isAllowed(scope,clean,'add','set');

		})
		.then(function (clean) {

			return service.adapter().add(clean);

		});

};

Service.prototype.allowed = function allowed(scope,original,privilege) {

	var acl = this.acl,
		allowed = {},
		keys = Object.keys(original),
		promises = new Array(keys.length),
		resource = this.resource;

	keys.forEach(function (key,i) {

		promises[i] = acl.isAllowed(scope,resource,privilege+'::'+key,original)
			.then(function () {

				allowed[key] = original[key];

				return true;

			})
			.catch(Exceptions.NotAllowed,function () {

				return true;

			});

	});

	return Promise.all(promises)
		.then(function done() {

			return allowed;

		});

};

Service.prototype._bootstrap = function bootstrap(application) {

	this.adapter()._bootstrap(application);

	if ('function' === typeof this.adapter().bootstrap) {

		this.adapter().bootstrap(application);

	}

};

Service.prototype.createCacheId = function createCacheId(fn,where,limit,offset,bypass) {

	var id = this._cacheId+fn;

	if (where) {

		Object.keys(where).forEach(function (key) {

			id += key+':'+where[key]+',';

		});

	}

	if (limit) {

		id += limit+',';

	}

	if (offset) {

		id += offset+',';

	}

	if (bypass) {

		id += bypass+',';

	}

	return id;

};

Service.prototype.createId = function createId(key,length) {

	return this.adapter().createId(key,length);

};

Service.prototype.delete = function (scope,data) {

	var service = this;

	return service.fetchOne(scope,data)
		.then(function (model) {

			return service.isAllowed(scope,model,'delete');

		})
		.then(function (clean) {

			return service.adapter().delete(clean);

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

Service.prototype.fetchAll = function fetchAll(scope,where,limit,offset,bypass,cache) {

	var id, result, service = this;

	if (cache) {

		id = service.createCacheId('fetchAll',where,limit,offset,bypass);

		result = scope.cache.get(id);

		if (undefined !== result) {

			return Promise.resolve(result);

		}

	}

	return service.isValid('fetchAll',scope,where)
		.then(function (clean) {

			return service.adapter().fetchAll(clean,limit,offset);

		})
		.then(function found(set) {

			//console.log('service.fetchAll',set);

			if (bypass) {

				return set;

			}

			return service.isAllowed(scope,set,'view','get');

		})
		.then(function (result) {

			if (cache) {

				scope.cache.put(id,result,1000);

			}

			return result;

		});

};

Service.prototype.fetchOne = function fetchOne(scope,where,bypass,cache) {

	var id, result, service = this;
/*
	if (cache) {

		id = service.createCacheId('fetchOne',where,1,undefined,bypass);

		result = scope.cache.get(id);

		if (null !== result) {

			console.log('cache 1',id);

			return Promise.resolve(result);

		}

	}
*/
	return service.isValid('fetchOne',scope,where)
		.then(function (clean) {

			return service.adapter().fetchOne(clean);

		})
		.then(function (results) {

			if (results.length === 0) {

				throw new Exceptions.NotFound();

			}

			if (bypass) {

				return results[0];

			}

			return service.isAllowed(scope,results[0],'view','get');

		})
		.then(function (result) {
/*
			if (cache) {

				console.log('cache 2',id);

				scope.cache.put(id,result,1000);

			}
*/
			return result;

		});

};

Service.prototype.fill = function fill(scope,model,options) {

	return Promise.resolve(model);

};

Service.prototype.fillSet = function fillSet(scope,set,options) {

	var promises;

	if (!Array.isArray(set)) {

		return this.fill(scope,set,options);

	}

	promises = new Array(set.length);

	for (var i = 0; i < set.length; i++) {

		promises[i] = this.fill(scope,set[i],options);

	}
	/*
	set.forEach(function (model) {

		promises.push(service.fill(scope,model));

	});
	*/
	return Promise.all(promises)
		.then(function () {

			return set;

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

		var allowed = [], promises = new Array(original.length);

		original.forEach(function (model,i) {

			promises[i] = service.isAllowed(scope,model,privilege,attribute)
				.then(function (model) {

					allowed.push(model);

					return true;

				})
				.catch(Exceptions.NotAllowed,function () {

					return true;

				});

		});

		return Promise.all(promises)
			.then(function () {

				return allowed;

			});

	} else {

		return service.acl.isAllowed(scope,service.resource,privilege,original)
			.then(function (original) {
				/*
				if (attribute) {

					return service.allowed(scope,original,attribute);

				} else {
				*/
					return original;
				/*
				}
				*/
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

module.exports = Service;
