var events = require('events');

function Response() {
	
	events.EventEmitter.call(this);
	
	this.content = '';
	this.headers = {};
	
}

Response.prototype = Object.create(events.EventEmitter.prototype);
Response.prototype.constructor = Response;

Response.prototype.setHeader = function (name,content) {
	
	this.headers[name] = content;
	
	return this;
	
};

Response.prototype.write = function (content) {
	
	this.content += content;
	
	return this;
	
};

Response.prototype.end = function () {
	
	this.emit('end');
	
};

module.exports = Response;