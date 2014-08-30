var Controller = require('../controller');
var Promise = require('../promise');

function OptionsController(config) {
	
	config = config || {};
	
	this.cache = config.cache || 60;
	this.methods = config.methods || [
		'DELETE',
		'POST',
		'PUT'
	];
	
	Controller.call(this,config);
	
}

OptionsController.prototype = Object.create(Controller.prototype);
OptionsController.prototype.constructor = OptionsController;

OptionsController.prototype.handle = function (request,response,scope) {
	
	response.statusCode = 200;
	
	response.setHeader('Access-Control-Allow-Methods',this.methods.join(','));
	
	if (this.cache) {
		
		response.setHeader('Cache-Control','private, max-age='+this.cache);
		
	}
	
	return Promise.resolve(true);
	
};

module.exports = OptionsController;