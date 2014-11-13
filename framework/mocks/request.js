var events = require('events');

function Request() {
	
	events.EventEmitter.call(this);
	
	this.headers = [];
	this.method = 'GET';
	this.query = {};
	this.url = '/';
	
}

Request.prototype = Object.create(events.EventEmitter.prototype);
Request.prototype.constructor = Request;

Request.prototype.close = function () {
	
	this.emit('close');
	
	return this;
	
};

Request.prototype.data = function (chunk) {
	
	this.emit('data',chunk);
	
	return this;
	
};

Request.prototype.end = function () {
	
	this.emit('end');
	
	return this;
	
};

Request.prototype.error = function (error) {
	
	this.emit('error',error);
	
	return this;
	
};

module.exports = Request;