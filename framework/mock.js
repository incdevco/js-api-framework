var crypto = require('crypto');

function Mock() {
	
	this.mocks = {};
	
}

Mock.prototype.called = function (id) {
	
	if (this.mocks.hasOwnProperty(id)) {
		
		this.mocks[id].called++;
		
	}
	
};

Mock.prototype.createId = function () {
	
	var id, unique = true;
	
	while (unique) {
		
		id = crypto.randomBytes(5).toString('hex').substr(0,5);
		
		/* istanbul ignore else  */
		if (!this.mocks.hasOwnProperty(id)) {
			
			unique = false;
			
		}
		
	}
	
	return id;
	
};

Mock.prototype.done = function (done) {
	
	for (var i in this.mocks) {
		
		if (this.mocks[i].called !== this.mocks[i].expects) {
			
			return done(new Error('function '+this.mocks[i].name+' was called '+this.mocks[i].called+' times, when expecting '+this.mocks[i].expects));
			
		}
		
	}
	
	return done();
	
};

Mock.prototype.function = function (config) {
	
	var id = this.createId(), mock = this;
	
	this.mocks[id] = {
		called: 0,
		expects: config.expects || 1,
		name: config.name
	};
	
	return function () {
		
		mock.called(id);
		
		return config.return;
		
	};
	
};

Mock.prototype.object = function (object,config) {
	
	var id = this.createId(), mock = this;
	
	this.mocks[id] = {
		called: 0,
		expects: config.expects || 1,
		name: config.name
	};
	
	object[config.name] = function () {
		
		mock.called(id);
		
		if (config.callback) {
			
			var callback = arguments[config.callback.argument];
			
			return callback(config.callback.error,config.callback.result);
			
		} else {
			
			return config.return;
			
		}
		
	};
	
};

module.exports = Mock;