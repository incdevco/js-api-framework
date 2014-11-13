var base = process.env.PWD;

var Framework = require(base+'/framework');

var server = new Framework.Server();

server.application = require('../application');

server.listen(8080);