var base = process.env.PWD;

var Framework = require(base+'/framework');

module.exports = function (application) {
	
	application.when('GET','/',function (scope,request,response) {
		
		response.write('test');
		
		return Framework.Promise.resolve(true);
		
	});
	
};