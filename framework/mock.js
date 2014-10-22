var Promise = require('./promise');

function Mock() {
	
	this.mocks = {};
	
}

Mock.prototype.done = function (done) {
	
	var mock = this,
		keys = Object.keys(this.mocks);
	
	keys.forEach(function (key) {
		
		var fns = Object.keys(mock.mocks[key]);
		
		fns.forEach(function (fn) {
			
			var mocked = mock.mocks[key][fn];
			
			if (mocked.calls.length !== mocked.called) {
				
				console.error('expected',mocked.mocked.calls.length);
				
				console.error('actual',mocked.called);
				
				throw new Error(mocked.name+'#'+mocked.fn+' called count does not match');
				
			}
			
		});
		
	});
	
	return done();
	
};

Mock.prototype.mock = function (object,name,fn) {
	
	if (undefined === this.mocks[name]) {
		
		this.mocks[name] = {};
		
	} 
	
	if (undefined === this.mocks[name][fn]) {
		
		this.mocks[name][fn] = new Mocked({
			name: name,
			fn: fn
		});
		
	}
	
	var mocked = this.mocks[name][fn];
	
	object[fn] = function () {
		
		return mocked.mocked.apply(mocked,arguments);
		
	};
	
	return mocked.next();
	
};

function Mocked(config) {
	
	this.called = 0;
	this.calls = [];
	this.fn = config.fn;
	this.name = config.name;
	
}

Mocked.prototype.call = function (index) {
	
	index = index - 1;
	
	return this.calls[index];
	
};

Mocked.prototype.mocked = function () {
	
	var index;
	
	this.called++;
	
	index = this.called - 1;
	
	if (undefined === this.calls[index]) {
		
		throw new Error(this.name+'#'+this.fn+' not expected to be called '+this.called+' times');
		
	}
	
	try {
		
		return this.calls[index].call.apply(this.calls[index],arguments);
		
	} catch (error) {
		
		throw new Error(this.name+'#'+this.fn+' '+error);
		
	}
	
};

Mocked.prototype.next = function () {
	
	var call = new MockedCall();
	
	this.calls.push(call);
	
	return call;
	
};

function MockedCall(config) {
	
	config = config || {};
	
	this._callback = config.callback;
	this._reject = config.reject;
	this._resolve = config.resolve;
	this._return = config.return;
	this._with = config.with;
	
}

MockedCall.prototype.call = function () {
	
	var args = arguments, mocked = this;
	
	if (this._with) {
		
		var keys = Object.keys(this._with);
		
		keys.forEach(function (index) {
			
			if (mocked._with[index] !== args[index]) {
				
				console.error('expected',index,mocked._with[index]);
				
				console.error('actual',index,args[index]);
				
				throw new Error('argument at '+index+' does not match');
				
			}
			
		});
		
	}
	
	if (undefined !== this._resolve) {
		
		return Promise.resolve(this._resolve);
		
	} else if (undefined !== this._reject) {
		
		return Promise.reject(this._reject);
		
	} else if (undefined !== this._callback) {
		
		return arguments[arguments.length - 1].apply(undefined,this._callback);
		
	} else if (undefined !== this._return) {
		
		return this._return;
		
	} else {
		
		return null;
		
	}
	
};

MockedCall.prototype.callback = function () {
	
	this._callback = arguments;
	
	return this;
	
};

MockedCall.prototype.reject = function (reject) {
	
	this._reject = reject;
	
	return this;
	
};

MockedCall.prototype.resolve = function (resolve) {
	
	this._resolve = resolve;
	
	return this;
	
};

MockedCall.prototype.return = function (_return) {
	
	this._return = _return;
	
	return this;
	
};

MockedCall.prototype.with = function () {
	
	this._with = arguments;
	
	return this;
	
};

module.exports = Mock;