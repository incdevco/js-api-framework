function Controller(config) {
	
	config = config || {};
	
	this.application = config.application;
	this.defaultService = config.defaultService;
	
}

Controller.prototype.service = function (name) {
	
	name = name || this.defaultService;
	
	return this.application.service(name);
	
};

module.exports = Controller;