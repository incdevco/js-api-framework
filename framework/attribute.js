var Promise = require('./promise');
var Validators = require('./validators');

function Attribute(config) {
	
	this.default = config.default;
	this.max = config.max;
	this.min = config.min;
	this.required = false;
	this.validators = config.validators || [];
	
	if (undefined !== config.required) {
		
		this.required = config.required;
		
	}
	
	if (undefined !== this.max || undefined !== this.min) {
		
		this.validators.push(new Validators.Length(config));
		
	}
	
}

Attribute.prototype.validate = function(value) {
	
	var promises = [];
	
	if (undefined === value || null === value) {
		
		if (this.required) {
			
			return Promise.reject('Required');
			
		} else {
			
			return Promise.resolve(true);
			
		}
		
	} else {
		
		for (var i = 0, length = this.validators.length; i < length; i++) {
			
			promises.push(this.validators[i].validate(value));
			
		}
		
		return Promise.all(promises).then(function () {
			
			return true;
			
		});
		
	}
	
};

module.exports = Attribute;