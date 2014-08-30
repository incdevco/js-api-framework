var Promise = require('./promise');

function Set() {
	
	this.length = 0;
	this.models = [];
	
}

Set.prototype.first = function () {
	
	return this.models[0];
	
};

Set.prototype.forEach = function (fn) {
	
	var i, length = this.models.length;
	
	for (i = 0; i < length; i++) {
		
		fn(this.models[i],i);
	
	}
	
};

Set.prototype.index = function (index) {
	
	return this.models[index];
	
};

Set.prototype.indexOf = function (search,fromIndex) {
	
	return this.models.indexOf(search, fromIndex);
	
};

Set.prototype.push = function (model) {
	
	this.models.push(model);
	
	this.length = this.models.length;
	
	return this;
	
};

Set.prototype.splice = function (index) {
	
	this.models = this.models.splice(index,1);
	
	this.length = this.models.length;
	
	return this;
	
};

Set.prototype.toData = function (scope) {
	
	var set = [], promises = [];
	
	for (var i = 0, length = this.models.length; i < length; i++) {
		
		promises.push(this.models[i].toData(scope).then(function (model) {
			
			set.push(model);
			
			return model;
			
		}));
	
	}
	
	return Promise.all(promises).then(function () {
		
		return set;
		
	});
	
};

Set.prototype.toJson = function (scope) {
	
	var set = [], promises = [];
	
	for (var i = 0, length = this.models.length; i < length; i++) {
		
		promises.push(this.models[i].toData(scope).then(function (model) {
			
			set.push(model);
			
			return model;
			
		}));
		
	}
	
	return Promise.all(promises).then(function () {
		
		return JSON.stringify(set);
		
	});

};

module.exports = Set;