var Expect = require("../expect");
var Merge = require("../merge");
var ModelService = require("../services").Model;
var Promise = require("../promise");

function ModelController(config) {
  "use strict";

  Expect(config).to.be.an("object", "config");

  if (config.acl) {

    Expect(config.acl).to.be.an("object", "config.acl");

    Expect(config.acl.isAllowed).to.be.a("function", "config.acl.isAllowed");

  }

  if (config.preparer) {

    Expect(config.preparer).to.be.an("object", "config.preparer");
    Expect(config.preparer.prepareModel).to.be.a("function", "config.preparer.prepareModel");
    Expect(config.preparer.prepareSet).to.be.a("function", "config.preparer.prepareSet");

  }

  Expect(config.resource).to.be.a("string", "config.resource");

  Expect(config.service).to.be.instanceof(ModelService, "config.service");

  this.acl = config.acl;

  this.preparer = config.preparer;

  this.resource = config.resource;

  this.service = config.service;

}

ModelController.prototype.add = function add() {
  "use strict";

  var crtl = this;

  return function handler(request, response, next) {

    var promise;

    if (crtl.acl) {

      promise = crtl.acl.isAllowed(request.user, crtl.resource, "add", request.body);

    } else {

      promise = Promise.resolve(request.body);

    }

    return promise
      .then(function (model) {

        return crtl.service.add(model);

      })
      .then(function (model) {

        if (crtl.preparer) {

          return crtl.preparer.prepareModel(model);

        } else {

          return model;

        }

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

ModelController.prototype.delete = function _delete() {
  "use strict";

  var crtl = this;

  return function handler(request, response, next) {

    return crtl.service.fetchOne(request.params)
      .then(function (model) {

        if (crtl.acl) {

          return crtl.acl.isAllowed(request.user, crtl.resource, "delete", model);

        } else {

          return model;

        }

      })
      .then(function (model) {

        return crtl.service.delete(model);

      })
      .then(function (model) {

        if (crtl.preparer) {

          return crtl.preparer.prepareModel(model);

        } else {

          return model;

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

ModelController.prototype.edit = function edit() {
  "use strict";

  var crtl = this;

  return function handler(request, response, next) {

    return crtl.service.fetchOne(request.params)
      .then(function (model) {

        if (crtl.acl) {

          return crtl.acl.isAllowed(request.user, crtl.resource, "edit", model);

        } else {

          return model;

        }

      })
      .then(function (model) {

        return crtl.service.edit(request.body, model);

      })
      .then(function (model) {

        if (crtl.preparer) {

          return crtl.preparer.prepareModel(model);

        } else {

          return model;

        }

      })
      .then(function (model) {

        response.status(200);

        response.json(model);

        return true;

      })
      .catch(next);

  };

};

ModelController.prototype.fetchAll = function fetchAll() {
  "use strict";

  var acl = this.acl,
    preparer = this.preparer,
    resource = this.resource,
    service = this.service;

  return function handler(request, response, next) {

    var where = Merge(true, request.params, request.query);

    return service.fetchAll(where, undefined, undefined, true)
      .then(function (query) {

        return acl.isAllowedQuery(request.user, resource, "view", query);

      })
      .then(function (set) {

        if (preparer) {

          return preparer.prepareSet(set);

        } else {

          return set;

        }

      })
      .then(function (set) {

        response.status(200);

        response.json(set);

        return true;

      })
      .catch(next);

  };

};

ModelController.prototype.fetchOne = function fetchOne() {
  "use strict";

  var crtl = this;

  return function handler(request, response, next) {

    var where = Merge(true, request.params, request.query);

    return crtl.service.fetchOne(where)
      .then(function (model) {

        if (crtl.acl) {

          return crtl.acl.isAllowed(request.user, crtl.resource, "view", model);

        } else {

          return model;

        }

      })
      .then(function (model) {

        if (crtl.preparer) {

          return crtl.preparer.prepareModel(model);

        } else {

          return model;

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

module.exports = ModelController;
