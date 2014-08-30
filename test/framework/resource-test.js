var base = process.env.PWD;

var expect = require('expect.js');

var Framework = require(base+'/framework');

describe('Framework.Resource',function () {
	
	it('construct with config.controllers',function () {
		
		var config = {
			controllers: {
				post: function (request,response,scope) {
					
					
					
				}
			}
		}, resource = new Framework.Resource(config);
		
		expect(resource.controllers.post).to.be.equal(config.controllers.post);
		
	});
	
});