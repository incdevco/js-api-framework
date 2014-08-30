var Controller = require('../controller');

function PutController(config) {
	
	Controller.call(this,config);
	
}

PutController.prototype = Object.create(Controller.prototype);
PutController.prototype.constructor = PutController;

PutController.prototype.handle = function (request,response,scope) {
	
	return this.service().fetchOne(request.params,scope).then(function (model) {
		
		return model.save(request.body,scope).then(function (model) {
			
			return model.toJson(scope).then(function (string) {
				
				response.statusCode = 200;
				response.write(string);
				
				return true;
				
			});
			
		});
		
	});
	
};

module.exports = PutController;