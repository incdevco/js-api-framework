var Expect = require('../index').Expect;
var Promise = require('../index').Promise;

function ModelService(config) {

  config = config || {};

  Expect(config.adapter).to.be.an('object');

  this.adapter = config.adapter;
  this.resource = config.resource;
  this.validators = config.validators || {};

  Expect(this.adapter.add).to.be.a('function');

  Expect(this.adapter.delete).to.be.a('function');

  Expect(this.adapter.edit).to.be.a('function');

  Expect(this.adapter.fetchAll).to.be.a('function');

  Expect(this.adapter.fetchOne).to.be.a('function');

  Object.keys(this.validators).forEach(function (key) {

    Expect(this.validators[key].validate).to.be.a('function');

  });

}

ModelService.prototype.add = function add(model) {

  var service = this;

  return service.validate('add',model)
    .then(function (model) {

      return service.adapter.add(model);

    });

};

ModelService.prototype.delete = function _delete(model) {

  var service = this;

  return service.validate('delete',model)
    .then(function (model) {

      return service.adapter.delete(model);

    });

};

ModelService.prototype.edit = function edit(oldModel,newModel) {

  var service = this;

  return service.validate('edit',newModel)
    .then(function (model) {

      return service.adapter.edit(model);

    });

};

ModelService.prototype.fetchAll = function fetchAll(where,limit,offset) {

  var service = this;

  return service.validate('fetchAll',where)
    .then(function (where) {

      return service.adapter.fetchAll(where,limit,offset);

    });

};

ModelService.prototype.fetchOne = function fetchOne(where,offset) {

  var service = this;

  return service.validate('fetchOne',where)
    .then(function (where) {

      return service.adapter.fetchOne(where,offset);

    });

};

ModelService.prototype.validate = function validate(key,value) {

  if (this.validators[key]) {

    return this.validators[key].validate(value,value);

  } else {

    return Promise.resolve(model);

  }

};

module.exports = ModelService;
