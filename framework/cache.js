var Promise = require('./promise');

function Cache(config) {
	
	this.items = {};
	
}

Cache.prototype.get = function (id) {
	
	if (undefined === this.items[id]) {
		
		return Promise.reject(false);
		
	} else {
		
		return Promise.resolve(this.items[id]);
		
	}
	
};

Cache.prototype.save = function (id,result) {
	
	this.items[id] = result;
	
	return Promise.resolve(this);
	
};

module.exports = Cache;