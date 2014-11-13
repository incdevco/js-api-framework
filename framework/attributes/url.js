var Attribute = require('../attribute');
var Validators = require('../validators');

function Url(config) {
	
	config = config || {};
	
	config.max = 30;
	
	if (undefined === config.validators) {
	
		config.validators = [
			new Validators.Url()
		];
		
	}
	
	Attribute.call(this,config);
	
}

Url.prototype = Object.create(Attribute.prototype);
Url.prototype.constructor = Url;

module.exports = Url;