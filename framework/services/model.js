var Expect = require('../expect');
var Promise = require('../promise');

function ModelService(config) {

  Expect(config).to.be.an('object','config');

  Expect(config.adapter).to.be.an('object','config.adapter');

  Expect(config.adapter.add).to.be.a('function','config.adapter.add');

  Expect(config.adapter.delete).to.be.a('function','config.adapter.delete');

  Expect(config.adapter.edit).to.be.a('function','config.adapter.edit');

  Expect(config.adapter.fetchAll).to.be.a('function','config.adapter.fetchAll');

  Expect(config.adapter.fetchOne).to.be.a('function','config.adapter.fetchOne');

  if (config.validators) {

    Object.keys(config.validators).forEach(function (key) {

      Expect(config.validators[key].validate).to.be.a('function','config.validators.'+key);

    });

  }

  this.adapter = config.adapter;
  this.resource = config.resource;
  this.validators = config.validators || {};

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
    .then(function (newModel) {

      return service.adapter.edit(oldModel,newModel);

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

    return Promise.resolve(value);

  }

};

module.exports = ModelService;
