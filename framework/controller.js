var Promise = require('./promise');

function Controller(config) {

  config = config || {};

  this.acl = config.acl;

  this.resource = config.resource;

  this.service = config.service;

}

Controller.prototype.add = function add() {

  var crtl = this;

  return function handler(request,response,next) {

    var promise;

    if (crtl.acl) {

      promise = crtl.acl.isAllowed(request.user,crtl.resource,'add',request.body);

    } else {

      promise = Promise.resolve(request.body);

    }

    return promise
      .then(function (model) {

        return crtl.service.add(model);

      })
      .then(function (model) {

        response.status(201);

        response.json(model);

        return true;

      })
      .catch(function (error) {

        return next(error);

      });

  };

};

Controller.prototype.delete = function _delete() {

  var crtl = this;

  return function handler(request,response,next) {

    return crtl.service.fetchOne(request.params)
      .then(function (model) {

        if (crtl.acl) {

          return crtl.acl.isAllowed(request.user,crtl.resource,'delete',model);

        } else {

          return model;

        }

      })
      .then(function (model) {

        return crtl.service.delete(model);

      })
      .then(function (model) {

        response.status(200);

        response.json(model);

        return true;

      })
      .catch(function (error) {

        return next(error);

      });

  };

};

Controller.prototype.edit = function edit() {

  var crtl = this;

  return function handler(request,response,next) {

    return crtl.service.fetchOne(request.params)
      .then(function (model) {

        if (crtl.acl) {

          return crtl.acl.isAllowed(request.user,crtl.resource,'edit',model);

        } else {

          return model;

        }

      })
      .then(function (model) {

        return crtl.service.edit(model,request.body);

      })
      .then(function (model) {

        response.status(200);

        response.json(model);

        return true;

      })
      .catch(function (error) {

        return next(error);

      });

  };

};

Controller.prototype.fetchAll = function fetchAll() {

  var acl = this.acl,
    resource = this.resource;

  return function handler(request,response,next) {

    var where = Merge(true,request.params,request.query);

    return crtl.service.fetchAll(where)
      .then(function (set) {

        var allowed, promises;

        if (acl) {

          allowed = [];

          promises = [];

          for (var i = 0; i < set.length; i++) {

            promises[i] = acl.isAllowed(request.user,resource,'view',set[i])
              .then(function (model) {

                allowed.push(model);

                return true;

              },function (error) {

                return false;

              });

          }

          return Promise.all(promises)
            .then(function () {

              return allowed;

            });
          
        } else {

          return set;

        }

      })
      .then(function (set) {

        response.status(200);

        response.json(set);

        return true;

      })
      .catch(function (error) {

        return next(error);

      });

  };

};

Controller.prototype.fetchOne = function fetchOne() {

  var crtl = this;

  return function handler(request,response,next) {

    var where = Merge(true,request.params,request.query);

    return crtl.service.fetchOne(where)
      .then(function (model) {

        if (crtl.acl) {

          return crtl.acl.isAllowed(request.user,crtl.resource,'view',model);

        } else {

          return set;

        }

      })
      .then(function (model) {

        response.status(200);

        response.json(model);

        return true;

      })
      .catch(function (error) {

        return next(error);

      });

  };

};

module.exports = Controller;
