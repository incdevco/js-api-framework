var base = process.env.PWD;
var util = require('util');

var Framework = require(base+'/framework');

var acl = require('../../../acl');
var service = require('../services/post');

function PostController(config) {

  config = config || {};

  config.acl = config.acl || acl;

  config.resource = config.resource || 'blog.post';

  config.service = config.service || service;

  Framework.Controller.call(this,config);

}

util.inherits(PostController,Framework.Controller);

module.exports = new PostController();

module.exports.PostController = PostController;
