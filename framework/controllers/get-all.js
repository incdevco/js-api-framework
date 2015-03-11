var Exceptions = require('../exceptions');

module.exports = function getAll(config) {

	return function controller(scope,request,response) {

		var limit = config.limit, 
			offset = 0,
			page = parseInt(request.query.page),
			service = scope.service(config.service);

		if (page) {

			offset = page * limit - limit;

		}

		return service.fetchAll(scope,request.query,limit,offset)
			.then(function found(set) {

				return service.fillSet(scope,set);

			})
			.then(function toJson(set) {

				response.statusCode = 200;
				response.write(JSON.stringify(set));

				return true;

			});

	};

};
