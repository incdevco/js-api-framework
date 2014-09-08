var Attribute = require('../attribute');

function NameAttribute(config) {
	
	config = config || {};
	
	config.max = 255;
	
	Attribute.call(this,config);
	
}

NameAttribute.prototype = Object.create(Attribute.prototype);
NameAttribute.prototype.constructor = NameAttribute;

module.exports = NameAttribute;