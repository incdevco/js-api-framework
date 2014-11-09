var Promise = require('./promise');
var Validators = require('./validators');

function Attribute(config) {
	
	config = config || {};
	
	this._default = config.default;
	this.max = config.max;
	this.min = config.min;
	this.required = false;
	this.validators = config.validators || [];
	
	if (Array.isArray(config.array)) {
		
		this.validators.push(new Validators.InArray(config.array));
		
	}
	
	if (config.create) {
		
		this.create = config.create;
		
	}
	
	if (typeof(config.exists) === 'object') {
		
		this.validators.push(new Validators.Exists(config.exists));
		
	}
	
	if (undefined !== this.max || undefined !== this.min) {
		
		this.validators.push(new Validators.Length(config));
		
	}
	
	if (undefined !== config.required) {
		
		this.required = config.required;
		
	}
	
	if (undefined !== config.service) {
		
		this.service = config.service;
		
	}
	
}

Attribute.prototype.default = function (scope) {
	
	if (this.required) {
		
		if (this.create) {
			
			return scope.service(this.service).adapter().createId(this.create);
			
		}
		
		return Promise.resolve(this._default);
		
	}
	
	return Promise.resolve(undefined);
	
};

Attribute.prototype.validate = function validate(scope,value,context) {
	
	var attribute = this, promise;
	
	if (undefined === value) {
		
		promise = this.default(scope);
		
	} else {
		
		promise = Promise.resolve(value);
		
	}
	
	return promise.then(function (value) {
		
		var promises = [];
		
		if (undefined === value || null === value) {
			
			if (attribute.required) {
				
				return Promise.reject('Required');
				
			} else {
				
				return Promise.resolve(value);
				
			}
			
		} else {
			
			attribute.validators.forEach(function (validator) {
				
				promises.push(validator.validate(scope,value,context));
				
			});
			
			return Promise.all(promises)
				.then(function () {
					
					return value;
					
				});
			
		}
		
	});
	
};

module.exports = Attribute;