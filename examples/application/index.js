var base = process.env.PWD;

var Framework = require(+'/framework');

var application = Framework.Express();

application.use(Framework.Middleware.bodyParser.urlencoded({
	extended: false
}));

application.use(Framework.Middleware.bodyParser.json());

require('./modules/blog')(application);

application.get('/',function (request,response) {

	response.json({
		version: '0.0.1'
	});

});

application.use(Framework.Middleware.errorHandler());

var server = application.listen(8080,function () {

	console.log('Application Ready @ 8080');

});

process.on('SIGTERM',function () {

	server.close(function () {

		console.log('Application Closed Gracefully');

	});

	setTimeout(function () {

		console.error('Application Closed Not Gracefully');

		process.exit(1);

	},30 * 1000);

});
