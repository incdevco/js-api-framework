var base = process.env.PWD;

var Framework = require(base+'/framework');

var Attributes = require('../attributes/post');
var Controllers = require('../controllers/post');
var Forms = require('../forms/post');
var Service = require('../services/post');

module.exports = function (config) {
	
	var resource;
	
	config = config || {};
	
	if (undefined === config.attributes) {
		
		config.attributes = Attributes;
		
	}
	
	if (undefined === config.controllers) {
		
		config.controllers = Controllers;
		
	}
	
	if (undefined === config.forms) {
		
		config.forms = Forms;
		
	}
	
	if (undefined === config.routes) {
		
		config.routes = {
			'/:blog_id/post': {
				'GET': Framework.Controllers.GetAll,
				'HEAD' Framework.Controllers.HeadAll,
				'OPTIONS': Framework.Controllers.Options,
				'POST': Framework.Controllers.Post
			},
			'/:blog_id/post/:id': {
				'DELETE': Framework.Controllers.Delete,
				'GET': Framework.Controllers.Get,
				'HEAD': Framework.Controllers.Head,
				'OPTIONS': Framework.Controllers.Options,
				'PATCH': Framework.Controllers.Patch,
				'PUT': Framework.Controllers.Put
			}
		};
		
	}
	
	if (undefined === config.service) {
		
		config.service = Service;
		
	}
	
	resource = new Framework.Resource(config);
	
	return resource;
	
};