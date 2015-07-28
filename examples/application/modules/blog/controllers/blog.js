var base = process.env.PWD;
var util = require('util');

var Framework = require(+'/framework');

var acl = require('../../../acl');
var service = require('../services/blog');

function BlogController(config) {

  config = config || {};

  config.acl = config.acl || acl;

  config.resource = config.resource || 'blog';

  config.service = config.service || service;

  Framework.Controller.call(this,config);

}

module.exports = new BlogController();

module.exports.BlogController = BlogController;
