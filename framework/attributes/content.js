var Attribute = require('../attribute');

function ContentAttribute(config) {
	
	config = config || {};
	
	config.max = 60000;
	
	Attribute.call(this,config);
	
}

ContentAttribute.prototype = Object.create(Attribute.prototype);
ContentAttribute.prototype.constructor = ContentAttribute;

module.exports = ContentAttribute;