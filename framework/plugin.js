function Plugin(config) {
	
	config = config || {};
	
	this.application = config.application;
	
}

Plugin.prototype.bootstrap = function (application) {
	
	this.application = application;
	
	return this;
	
};

Plugin.prototype.service = function (name) {
	
	return this.application.service(name);
	
};

module.exports = Plugin;