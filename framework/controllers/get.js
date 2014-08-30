var Controller = require('../controller');

function GetController(config) {
	
	this.cache = config.cache || 60;
	
	Controller.call(this,config);
	
}

GetController.prototype = Object.create(Controller.prototype);
GetController.prototype.constructor = GetController;

GetController.prototype.handle = function (request,response,scope) {
	
	var controller = this;
	
	return this.service().fetchOne(request.params,scope).then(function (model) {
		
		return model.toJson(scope).then(function (string) {
			
			response.statusCode = 200;
			
			if (controller.cache) {
				
				response.setHeader('Cache-Control','private, max-age='+controller.cache);
				
			}
			
			response.write(string);
			
			return true;
			
		});
		
	});
	
};

module.exports = GetController;