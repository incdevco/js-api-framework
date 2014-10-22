var events = require('events');

function Request() {
	
	events.EventEmitter.call(this);
	
	this.headers = [];
	this.method = 'GET';
	this.url = '/';
	
}

Request.prototype = Object.create(events.EventEmitter.prototype);
Request.prototype.constructor = Request;

module.exports = Request;