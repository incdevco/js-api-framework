function Assertion(config) {
	
	this.application = config.application;
	
}

Assertion.prototype.service = function (name) {
	
	return this.application.service(name);
	
};

module.exports = Assertion;