var Expect = require("../expect");
var Promise = require("../promise");

function Service(config) {
  "use strict";

  Expect(config).to.be.an("object", "config");

  Expect(config.adapter).to.be.an("object", "config.adapter");

  Expect(config.adapter.add).to.be.a("function", "config.adapter.add");
  Expect(config.adapter.delete).to.be.a("function", "config.adapter.delete");
  Expect(config.adapter.edit).to.be.a("function", "config.adapter.edit");
  Expect(config.adapter.fetchAll).to.be.a("function", "config.adapter.fetchAll");
  Expect(config.adapter.fetchOne).to.be.a("function", "config.adapter.fetchOne");

  if (config.validators) {

    Object.keys(config.validators).forEach(function (key) {

      Expect(config.validators[key].validate).to.be.a("function", "config.validators." + key);

    });

  }

  this.adapter = config.adapter;
  this.resource = config.resource;
  this.validators = config.validators || {};

}

Service.prototype.add = function add(model, transaction) {
  "use strict";

  var service = this;

  return service.validate("add", model)
    .then(function () {

      return service.adapter.add(model, transaction);

    });

};

Service.prototype.delete = function _delete(model, transaction) {
  "use strict";

  var service = this;

  return service.validate("delete", model)
    .then(function () {

      return service.adapter.delete(model, transaction);

    });

};

Service.prototype.edit = function edit(model, old, transaction) {
  "use strict";

  var service = this;

  return service.validate("edit", model)
    .then(function () {

      return service.adapter.edit(model, old, transaction);

    });

};

Service.prototype.fetchAll = function fetchAll(where, limit, offset, returnQuery, transaction) {
  "use strict";

  var service = this;

  return service.validate("fetchAll", where)
    .then(function () {

      return service.adapter.fetchAll(where, limit, offset, returnQuery, transaction);

    });

};

Service.prototype.fetchOne = function fetchOne(where, offset, transaction) {
  "use strict";

  var service = this;

  return service.validate("fetchOne", where)
    .then(function () {

      return service.adapter.fetchOne(where, offset, transaction);

    });

};

Service.prototype.validate = function validate(key, value) {
  "use strict";

  if (this.validators[key]) {

    return this.validators[key].validate(value, value);

  } else {

    return Promise.resolve(value);

  }

};

module.exports = Service;
