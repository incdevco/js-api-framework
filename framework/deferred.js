var Promise = require('./promise');

function Deferred() {
	
	var deferred = this;
	
	this.promise = new Promise(function (resolve,reject) {
		
		deferred.resolve = resolve;
		
		deferred.reject = reject;
		
	});
	
}

module.exports = Deferred;

