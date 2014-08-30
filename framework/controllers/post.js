var Controller = require('../controller');

function PostController(config) {
	
	Controller.call(this,config);
	
}

PostController.prototype = Object.create(Controller.prototype);
PostController.prototype.constructor = PostController;

PostController.prototype.handle = function (request,response,scope) {
	
	return this.service().fetchNew().then(function (model) {
		
		return model.save(request.body,scope).then(function (model) {
			
			return model.toJson(scope).then(function (string) {
				
				response.statusCode = 201;
				response.write(string);
				
				return true;
				
			});
			
		});
		
	});
	
};

module.exports = PostController;