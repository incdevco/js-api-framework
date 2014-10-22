var base = process.env.PWD;

var Framework = require(base+'/framework');

var application = new Framework.Application();

application.module('test',require('./modules/test'));

application.bootstrap();

module.exports = application;