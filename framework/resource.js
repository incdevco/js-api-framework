var Promise = require('./promise');

var DeleteController = require('./controllers/delete');
var GetController = require('./controllers/get');
var GetAllController = require('./controllers/get-all');
var OptionsController = require('./controllers/options');
var PostController = require('./controllers/post');
var PutController = require('./controllers/put');

function Resource(config) {
	
	config.controllers = config.controllers || {};
	
	this.controllers = {};
	this.key = config.key;
	this.param = config.param;
	this.path = config.path;
	this.service = config.service || config.key;
	
	this.controllers.delete = config.controllers.delete || DeleteController;
	this.controllers.get = config.controllers.get || GetController;
	this.controllers.getAll = config.controllers.getAll || GetAllController;
	this.controllers.options = config.controllers.options || OptionsController;
	this.controllers.post = config.controllers.post || PostController;
	this.controllers.put = config.controllers.put || PutController;
	
}

Resource.prototype.bootstrap = function (application) {
	
	application.controller(this.key+'DeleteController',this.createController(this.controllers.delete));
	application.controller(this.key+'GetController',this.createController(this.controllers.get));
	application.controller(this.key+'GetAllController',this.createController(this.controllers.getAll));
	application.controller(this.key+'OptionsController',this.createController(this.controllers.options));
	application.controller(this.key+'PostController',this.createController(this.controllers.post));
	application.controller(this.key+'PutController',this.createController(this.controllers.put));
	
	application.when('GET',this.path,this.key+'GetAllController');
	application.when('OPTIONS',this.path,this.key+'OptionsController');
	application.when('POST',this.path,this.key+'PostController');
	
	application.when('GET',this.path+'/:'+this.param,this.key+'GetController');
	application.when('DELETE',this.path+'/:'+this.param,this.key+'DeleteController');
	application.when('OPTIONS',this.path+'/:'+this.param,this.key+'OptionsController');
	application.when('PUT',this.path+'/:'+this.param,this.key+'PutController');
	
};

Resource.prototype.createController = function (controller) {
	
	controller = new controller({
		defaultService: this.service
	});
	
	return controller;
	
};

module.exports = Resource;