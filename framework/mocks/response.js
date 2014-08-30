function Response() {
	
	this.content = '';
	this.headers = {};
	
}

Response.prototype.setHeader = function (name,content) {
	
	this.headers[name] = content;
	
	return this;
	
};

Response.prototype.write = function (content) {
	
	this.content = content;
	
	return this;
	
};

module.exports = Response;