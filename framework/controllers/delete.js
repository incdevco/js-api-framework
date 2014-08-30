var Controller = require('../controller');

function DeleteController(config) {
	
	Controller.call(this,config);
	
}

DeleteController.prototype = Object.create(Controller.prototype);
DeleteController.prototype.constructor = DeleteController;

DeleteController.prototype.handle = function (request,response,scope) {
	
	return this.service().fetchOne(request.params,scope).then(function (model) {
		
		return model.delete(scope).then(function (model) {
			
			return model.toJson(scope).then(function (string) {
				
				response.statusCode = 200;
				response.write(string);
				
				return true;
				
			});
			
		});
		
	});
	
};

module.exports = DeleteController;