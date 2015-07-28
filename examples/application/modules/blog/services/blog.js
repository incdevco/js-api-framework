var base = process.env.PWD;
var util = require('util');

var Framework = require(+'/framework');

var adapter = require('../adapters/blog/mysql');
var validators = require('../validators/blog');

function BlogService(config) {

	config = config || {};

	config.adapter = config.adapter || adapter;

}

module.exports = function BlogService(config) {

	config = config || {};

	config.adapter = config.adapter || adapter;

	service = new Framework.Service(config);

	return service;

};
