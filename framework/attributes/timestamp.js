var Attribute = require('../attribute');
var Moment = require('../moment');
var Promise = require('../promise');
var Validators = require('../validators');

function TimestampAttribute(config) {
	
	config = config || {};
	
	config.max = 20;
	
	if (undefined === config.validators) {
	
		config.validators = [
			new Validators.Float()
		];
		
	}
	
	Attribute.call(this,config);
	
	if (config.now) {
		
		this.now = true;
		
	}
	
}

TimestampAttribute.prototype = Object.create(Attribute.prototype);
TimestampAttribute.prototype.constructor = TimestampAttribute;

TimestampAttribute.prototype.default = function (scope) {
	
	if (this.required) {
		
		if (this.now) {
			
			return Promise.resolve(Moment().valueOf());
			
		}
		
		return Promise.resolve(this._default);
		
	}
	
	return Promise.resolve(undefined);
	
};

module.exports = TimestampAttribute;