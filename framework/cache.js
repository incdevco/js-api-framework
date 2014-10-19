function Cache(config) {
	
	this.items = {};
	
}

Cache.prototype.delete = function (id) {
	
	delete this.items[id];
	
	return this;
	
};

Cache.prototype.get = function (id) {
	
	if (this.items.hasOwnProperty(id)) {
		
		return this.items[id];
		
	}
	
	return undefined;
	
};

Cache.prototype.put = function (id,result) {
	
	this.items[id] = result;
	
	return this;
	
};

module.exports = Cache;