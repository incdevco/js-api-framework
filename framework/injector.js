function Injector(parent) {
	
	this.items = {};
	this.modules = {};
	this.parent = parent;
	this.services = {};
	
}

Injector.prototype.get = function (key) {
	
	var item;
	
	if (key === 'Injector') {
		
		return this;
	
	} else {
		
		item = this.items[key]
		
		if (undefined === item && undefined !== this.parent) {
			
			return this.parent.get(key);
		
		}
	
	}
	
	return item;
	
};

Injector.prototype.invoke = function (original,locals) {
	
	var injectable = original.slice(0),
		fn = injectable.pop(),
		args = [],
		locals = locals || {},
		length,i;
		
	for (i = 0, length = injectable.length; i < length; i++) {
	
		if (Array.isArray(injectable[i])) {
		
			args.push(this.invoke(injectable[i]));
			
		} else {
			
			if (locals.hasOwnProperty(injectable[i])) {
				
				args.push(locals[injectable[i]]);
				
			} else {
				
				args.push(this.get(injectable[i]));
				
			}
			
		}
		
	}
	
	return fn.apply(null,args);
	
};

Injector.prototype.module = function (name,module) {
	
	if (module) {
		
		this.modules[name] = module;
		
		return this;
		
	} else {
	
		var result = this.modules[name];
		
		if (undefined === result && this.parent) {
				
			return this.parent.module(name);
			
		}
		
		return result;
		
	}
	
};

Injector.prototype.service = function (name,service) {
	
	if (service) {
		
		this.services[name] = service;
		
		return this;
		
	} else {
	
		var result = this.services[name];
		
		if (undefined === result && this.parent) {
				
			return this.parent.service(name);
			
		}
		
		return result;
		
	}
	
};

Injector.prototype.set = function (key,item) {
	
	this.items[key] = item;
	
	return this;

};

module.exports = Injector;