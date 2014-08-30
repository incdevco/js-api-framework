function Injector(parent) {
	
	this.items = {};
	this.parent = parent;
	
}

Injector.prototype.get = function (key) {
	
	var item;
	
	if (key === 'Injector') {
		
		return this;
	
	} else {
		
		item = this.items[key]
		
		if (undefined === item && undefined !== this.parent) {
			
			return this.parent.get(key,locals);
		
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

Injector.prototype.set = function (key,item) {
	
	this.items[key] = item;
	
	return this;

};

module.exports = Injector;