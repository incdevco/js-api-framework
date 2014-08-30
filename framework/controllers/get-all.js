var Controller = require('../controller');

function GetAllController(config) {
	
	if (undefined === config.cache) {
	
		this.cache = 60;
	
	} else {
		
		this.cache = config.cache;
		
	}
	
	Controller.call(this,config);
	
}

GetAllController.prototype = Object.create(Controller.prototype);
GetAllController.prototype.constructor = GetAllController;

GetAllController.prototype.handle = function (request,response,scope) {
	
	var controller = this;
	
	return this.service().fetchAll(request.params,request.limit,request.offset,scope).then(function (set) {
		
		return set.toJson(scope).then(function (string) {
			
			response.statusCode = 200;
			
			if (controller.cache) {
				
				response.setHeader('Cache-Control','private, max-age='+controller.cache);
				
			}
			
			response.setHeader('X-Actual-Length',set.actualLength);
			
			response.write(string);
			
			return true;
			
		});
		
	});
	
};

module.exports = GetAllController;