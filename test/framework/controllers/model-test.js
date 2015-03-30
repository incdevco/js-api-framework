var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Controllers.Model',function () {

  it('constructor',function () {

    var controller = new Framework.Controllers.Model({
      acl: new Framework.Acl(),
      resource: 'test',
      service: new Framework.Services.Model({
        adapter: new Framework.Adapters.MysqlModel({
          pool: {},
          primary: ['id'],
          table: 'test'
        })
      })
    });

  });

  it('add with acl calls acl.isAllowed with request.user, resource, privilege and body, service.add with model, response.status with 201 and response.json with model',function (done) {

    var controller = new Framework.Controllers.Model({
        acl: new Framework.Acl(),
        resource: 'test',
        service: new Framework.Services.Model({
          adapter: new Framework.Adapters.MysqlModel({
            pool: {},
            primary: ['id'],
            table: 'test'
          })
        })
      }),
      mock = new Framework.Mock(),
      request = {
        user: {},
        body: {}
      },
      response = {};

    mock.mock('acl',controller.acl,'isAllowed')
      .with(request.user,controller.resource,'add',request.body)
      .resolve(request.body);

    mock.mock('service',controller.service,'add')
      .with(request.body)
      .resolve(request.body);

    mock.mock('response',response,'status')
      .with(201)
      .return(true);

    mock.mock('response',response,'json')
      .with(request.body)
      .return(true);

    controller.add()(request,response,done)
      .then(function () {

        return mock.done(done);

      })
      .catch(done);

  });

  it('add without acl calls service.add with model which rejects and calls next with error',function (done) {

    var controller = new Framework.Controllers.Model({
        resource: 'test',
        service: new Framework.Services.Model({
          adapter: new Framework.Adapters.MysqlModel({
            pool: {},
            primary: ['id'],
            table: 'test'
          })
        })
      }),
      mock = new Framework.Mock(),
      request = {
        user: {},
        body: {}
      },
      response = {},
      next = {},
      error = new Error('test');

    mock.mock('service',controller.service,'add')
      .with(request.body)
      .reject(error);

    mock.mock('next',next,'next')
      .with(error)
      .return(true);

    controller.add()(request,response,next.next)
      .then(function () {

        return mock.done(done);

      })
      .catch(done);

  });

  it('delete with acl calls service.fetchOne with request.params, acl.isAllowed with request.user, resource, privilege and body, service.delete with model, response.status with 200 and response.json with model',function (done) {

    var controller = new Framework.Controllers.Model({
        acl: new Framework.Acl(),
        resource: 'test',
        service: new Framework.Services.Model({
          adapter: new Framework.Adapters.MysqlModel({
            pool: {},
            primary: ['id'],
            table: 'test'
          })
        })
      }),
      mock = new Framework.Mock(),
      request = {
        user: {},
        params: {},
        body: {}
      },
      response = {},
      model = {};

    mock.mock('service',controller.service,'fetchOne')
      .with(request.params)
      .resolve(model);

    mock.mock('acl',controller.acl,'isAllowed')
      .with(request.user,controller.resource,'delete',model)
      .resolve(model);

    mock.mock('service',controller.service,'delete')
      .with(model)
      .resolve(model);

    mock.mock('response',response,'status')
      .with(200)
      .return(true);

    mock.mock('response',response,'json')
      .with(model)
      .return(true);

    controller.delete()(request,response,done)
      .then(function () {

        return mock.done(done);

      })
      .catch(done);

  });

  it('delete without acl calls service.fetchOne with request.params,'
    +' service.delete with model which rejects and calls next with error',function (done) {

    var controller = new Framework.Controllers.Model({
        resource: 'test',
        service: new Framework.Services.Model({
          adapter: new Framework.Adapters.MysqlModel({
            pool: {},
            primary: ['id'],
            table: 'test'
          })
        })
      }),
      mock = new Framework.Mock(),
      request = {
        user: {},
        params: {},
        body: {}
      },
      response = {},
      model = {},
      next = {},
      error = new Error('test');

    mock.mock('service',controller.service,'fetchOne')
      .with(request.params)
      .resolve(model);

    mock.mock('service',controller.service,'delete')
      .with(model)
      .reject(error);

    mock.mock('next',next,'next')
      .with(error)
      .return(true);

    controller.delete()(request,response,next.next)
      .then(function () {

        return mock.done(done);

      })
      .catch(done);

  });

  it('edit with acl calls service.fetchOne with request.params,'
    +' acl.isAllowed with request.user, resource, privilege and body,'
    +' service.edit with model, response.status with 200 and response.json with model',function (done) {

    var controller = new Framework.Controllers.Model({
        acl: new Framework.Acl(),
        resource: 'test',
        service: new Framework.Services.Model({
          adapter: new Framework.Adapters.MysqlModel({
            pool: {},
            primary: ['id'],
            table: 'test'
          })
        })
      }),
      mock = new Framework.Mock(),
      request = {
        user: 'user',
        params: 'params',
        body: 'body'
      },
      response = {},
      model = 'model';

    mock.mock('service',controller.service,'fetchOne')
      .with(request.params)
      .resolve(model);

    mock.mock('acl',controller.acl,'isAllowed')
      .with(request.user,controller.resource,'edit',model)
      .resolve(model);

    mock.mock('service',controller.service,'edit')
      .with(model,request.body)
      .resolve(request.body);

    mock.mock('response',response,'status')
      .with(200)
      .return(true);

    mock.mock('response',response,'json')
      .with(request.body)
      .return(true);

    controller.edit()(request,response,done)
      .then(function () {

        return mock.done(done);

      })
      .catch(done);

  });

  it('edit without acl calls service.fetchOne with request.params,'
    +' service.edit with model which rejects and calls next with error',function (done) {

    var controller = new Framework.Controllers.Model({
        resource: 'test',
        service: new Framework.Services.Model({
          adapter: new Framework.Adapters.MysqlModel({
            pool: {},
            primary: ['id'],
            table: 'test'
          })
        })
      }),
      mock = new Framework.Mock(),
      request = {
        user: 'user',
        params: 'params',
        body: 'body'
      },
      response = {},
      model = 'model',
      next = {},
      error = new Error('test');

    mock.mock('service',controller.service,'fetchOne')
      .with(request.params)
      .resolve(model);

    mock.mock('service',controller.service,'edit')
      .with(model,request.body)
      .reject(error);

    mock.mock('next',next,'next')
      .with(error)
      .return(true);

    controller.edit()(request,response,next.next)
      .then(function () {

        return mock.done(done);

      })
      .catch(done);

  });

  it('fetchAll with acl calls service.fetchAll with merged request.params and request.query,'
    +' acl.isAllowed twice which resolves then rejects,'
    +' response.status with 200 and response.json with allowed',function (done) {

    var controller = new Framework.Controllers.Model({
        acl: new Framework.Acl(),
        resource: 'test',
        service: new Framework.Services.Model({
          adapter: new Framework.Adapters.MysqlModel({
            pool: {},
            primary: ['id'],
            table: 'test'
          })
        })
      }),
      mock = new Framework.Mock(),
      request = {
        user: 'user',
        params: {'params':'params'},
        query: {'query':'query'},
        body: 'body'
      },
      response = {},
      merged = {
        'params':'params',
        'query':'query'
      },
      set = [
        'model1',
        'model2'
      ],
      allowed = [
        set[0]
      ];

    mock.mock('service',controller.service,'fetchAll')
      .with(merged)
      .resolve(set);

    mock.mock('acl',controller.acl,'isAllowed')
      .with(request.user,controller.resource,'view',set[0])
      .resolve(set[0]);

    mock.mock('acl',controller.acl,'isAllowed')
      .with(request.user,controller.resource,'view',set[1])
      .reject(false);

    mock.mock('response',response,'status')
      .with(200)
      .return(true);

    mock.mock('response',response,'json')
      .with(allowed)
      .return(true);

    controller.fetchAll()(request,response,done)
      .then(function () {

        return mock.done(done);

      })
      .catch(done);

  });

  it('fetchAll without acl calls service.fetchAll with merged request.params and request.query,'
    +' response.status with 200 and response.json with set',function (done) {

    var controller = new Framework.Controllers.Model({
        resource: 'test',
        service: new Framework.Services.Model({
          adapter: new Framework.Adapters.MysqlModel({
            pool: {},
            primary: ['id'],
            table: 'test'
          })
        })
      }),
      mock = new Framework.Mock(),
      request = {
        user: 'user',
        params: {'params':'params'},
        query: {'query':'query'},
        body: 'body'
      },
      response = {},
      merged = {
        'params':'params',
        'query':'query'
      },
      set = [
        'model1',
        'model2'
      ];

    mock.mock('service',controller.service,'fetchAll')
      .with(merged)
      .resolve(set);

    mock.mock('response',response,'status')
      .with(200)
      .return(true);

    mock.mock('response',response,'json')
      .with(set)
      .return(true);

    controller.fetchAll()(request,response,done)
      .then(function () {

        return mock.done(done);

      })
      .catch(done);

  });

  it('fetchAll without acl calls service.fetchAll with merged request.params'
    +' and request.query which rejects then calls next with error',function (done) {

    var controller = new Framework.Controllers.Model({
        resource: 'test',
        service: new Framework.Services.Model({
          adapter: new Framework.Adapters.MysqlModel({
            pool: {},
            primary: ['id'],
            table: 'test'
          })
        })
      }),
      mock = new Framework.Mock(),
      request = {
        user: 'user',
        params: {'params':'params'},
        query: {'query':'query'},
        body: 'body'
      },
      response = {},
      merged = {
        'params':'params',
        'query':'query'
      },
      error = new Error('error'),
      next = {};

    mock.mock('service',controller.service,'fetchAll')
      .with(merged)
      .reject(error);

    mock.mock('next',next,'next')
      .with(error)
      .return(true);

    controller.fetchAll()(request,response,next.next)
      .then(function () {

        return mock.done(done);

      })
      .catch(done);

  });

  it('fetchOne with acl calls service.fetchOne with merged request.params and request.query,'
    +' acl.isAllowed twice which resolves then rejects,'
    +' response.status with 200 and response.json with allowed',function (done) {

    var controller = new Framework.Controllers.Model({
        acl: new Framework.Acl(),
        resource: 'test',
        service: new Framework.Services.Model({
          adapter: new Framework.Adapters.MysqlModel({
            pool: {},
            primary: ['id'],
            table: 'test'
          })
        })
      }),
      mock = new Framework.Mock(),
      request = {
        user: 'user',
        params: {'params':'params'},
        query: {'query':'query'},
        body: 'body'
      },
      response = {},
      merged = {
        'params':'params',
        'query':'query'
      },
      model = 'model';

    mock.mock('service',controller.service,'fetchOne')
      .with(merged)
      .resolve(model);

    mock.mock('acl',controller.acl,'isAllowed')
      .with(request.user,controller.resource,'view',model)
      .resolve(model);

    mock.mock('response',response,'status')
      .with(200)
      .return(true);

    mock.mock('response',response,'json')
      .with(model)
      .return(true);

    controller.fetchOne()(request,response,done)
      .then(function () {

        return mock.done(done);

      })
      .catch(done);

  });

  it('fetchOne without acl calls service.fetchOne with merged request.params and request.query,'
    +' response.status with 200 and response.json with set',function (done) {

    var controller = new Framework.Controllers.Model({
        resource: 'test',
        service: new Framework.Services.Model({
          adapter: new Framework.Adapters.MysqlModel({
            pool: {},
            primary: ['id'],
            table: 'test'
          })
        })
      }),
      mock = new Framework.Mock(),
      request = {
        user: 'user',
        params: {'params':'params'},
        query: {'query':'query'},
        body: 'body'
      },
      response = {},
      merged = {
        'params':'params',
        'query':'query'
      },
      model = 'model';

    mock.mock('service',controller.service,'fetchOne')
      .with(merged)
      .resolve(model);

    mock.mock('response',response,'status')
      .with(200)
      .return(true);

    mock.mock('response',response,'json')
      .with(model)
      .return(true);

    controller.fetchOne()(request,response,done)
      .then(function () {

        return mock.done(done);

      })
      .catch(done);

  });

  it('fetchOne without acl calls service.fetchOne with merged request.params'
    +' and request.query which rejects then calls next with error',function (done) {

    var controller = new Framework.Controllers.Model({
        resource: 'test',
        service: new Framework.Services.Model({
          adapter: new Framework.Adapters.MysqlModel({
            pool: {},
            primary: ['id'],
            table: 'test'
          })
        })
      }),
      mock = new Framework.Mock(),
      request = {
        user: 'user',
        params: {'params':'params'},
        query: {'query':'query'},
        body: 'body'
      },
      response = {},
      merged = {
        'params':'params',
        'query':'query'
      },
      error = new Error('error'),
      next = {};

    mock.mock('service',controller.service,'fetchOne')
      .with(merged)
      .reject(error);

    mock.mock('next',next,'next')
      .with(error)
      .return(true);

    controller.fetchOne()(request,response,next.next)
      .then(function () {

        return mock.done(done);

      })
      .catch(done);

  });

});
