var base = process.env.PWD;

var Framework = require(+'/framework');

var Id = require('../../attributes/post/id');
var BlogId = require('../../attributes/blog/id');
var Title = require('../../attributes/post/title');
var Content = require('../../attributes/post/content');

module.exports = function (config) {
	
	var form;
	
	config = config || {};
	
	if (undefined === config.attributes) {
	
		config.attributes = {
			id: Id,
			blog_id: BlogId,
			title: Title,
			content: Content
		};
		
	}
	
	form = new Framework.Form(config);
	
	return form;
	
};