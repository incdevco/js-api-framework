var base = process.env.PWD;

var expect = require('expect.js');

var Framework = require(base+'/framework');

describe('Plugins.Url',function () {
	
	it('beforeRoute',function (done) {
		
		var application = new Framework.Application({}),
			request = new Framework.Mocks.Request(),
			response = new Framework.Mocks.Response(),
			scope = new Framework.Scope(),
			mock = new Framework.Mock();
		
		request.url = '/test?id=test&test=null&testfalse=false&testtrue=true';
		
		Framework.Plugins.ParseUrl.beforeRoute(request,response,scope).then(function () {
			
			try {
				
				expect(request.url).to.be.eql({
					protocol: null,
					slashes: null,
					auth: null,
					host: null,
					port: null,
					hostname: null,
					hash: null,
					search: '?id=test&test=null&testfalse=false&testtrue=true',
					query: 'id=test&test=null&testfalse=false&testtrue=true',
					pathname: '/test',
					path: '/test?id=test&test=null&testfalse=false&testtrue=true',
					href: '/test?id=test&test=null&testfalse=false&testtrue=true'
				});
				expect(request.query).to.be.eql({
					id: 'test',
					test: null,
					testfalse: false,
					testtrue: true
				});
				
				done();
				
			} catch (error) {
				
				done(error);
				
			}
				
		});
		
	});
	
});