var base = process.env.PWD;

var Framework = require(base + "/framework");

describe("Framework.Services.Model", function () {
  "use strict";

  it("constructor", function () {

    var service = new Framework.Services.Model({
      adapter: new Framework.Adapters.Model.Mysql({
        pool: {},
        primary: ["id"],
        table: "table"
      }),
      validators: {
        add: new Framework.Validators.Object()
      }
    });

    Framework.Expect(service.validators.add).to.be.instanceof(Framework.Validators.Object);

  });

  it("add calls validate with model and adapter.add with model", function (done) {

    var service = new Framework.Services.Model({
        adapter: new Framework.Adapters.Model.Mysql({
          pool: {},
          primary: ["id"],
          table: "table"
        }),
        validators: {
          add: new Framework.Validators.Object()
        }
      }),
      model = "model",
      mock = new Framework.Mock();

    mock.mock("service", service, "validate")
      .with("add", model)
      .resolve(model);

    mock.mock("adapter", service.adapter, "add")
      .with(model)
      .resolve(model);

    service.add(model)
      .then(function (result) {

        Framework.Expect(result).to.be.equal(model);

        return mock.done(done);

      })
      .catch(done);

  });

  it("delete calls validate with model and adapter.delete with model", function (done) {

    var service = new Framework.Services.Model({
        adapter: new Framework.Adapters.Model.Mysql({
          pool: {},
          primary: ["id"],
          table: "table"
        }),
        validators: {
          add: new Framework.Validators.Object()
        }
      }),
      model = "model",
      mock = new Framework.Mock();

    mock.mock("service", service, "validate")
      .with("delete", model)
      .resolve(model);

    mock.mock("adapter", service.adapter, "delete")
      .with(model)
      .resolve(model);

    service.delete(model)
      .then(function (result) {

        Framework.Expect(result).to.be.equal(model);

        return mock.done(done);

      })
      .catch(done);

  });

  it("edit calls validate with model and adapter.edit with model", function (done) {

    var service = new Framework.Services.Model({
        adapter: new Framework.Adapters.Model.Mysql({
          pool: {},
          primary: ["id"],
          table: "table"
        }),
        validators: {
          add: new Framework.Validators.Object()
        }
      }),
      oldModel = "oldModel",
      newModel = "newModel",
      mock = new Framework.Mock();

    mock.mock("service", service, "validate")
      .with("edit", newModel)
      .resolve(newModel);

    mock.mock("adapter", service.adapter, "edit")
      .with(newModel, oldModel)
      .resolve(newModel);

    service.edit(newModel, oldModel)
      .then(function (result) {

        Framework.Expect(result).to.be.equal(newModel);

        return mock.done(done);

      })
      .catch(done);

  });

  it("fetchAll calls validate with where and adapter.fetchAll with where, limit, offset", function (done) {

    var service = new Framework.Services.Model({
        adapter: new Framework.Adapters.Model.Mysql({
          pool: {},
          primary: ["id"],
          table: "table"
        }),
        validators: {
          add: new Framework.Validators.Object()
        }
      }),
      where = "where",
      limit = "limit",
      offset = "offset",
      set = "set",
      mock = new Framework.Mock();

    mock.mock("service", service, "validate")
      .with("fetchAll", where)
      .resolve(where);

    mock.mock("adapter", service.adapter, "fetchAll")
      .with(where, limit, offset)
      .resolve(set);

    service.fetchAll(where, limit, offset)
      .then(function (result) {

        Framework.Expect(result).to.be.equal(set);

        return mock.done(done);

      })
      .catch(done);

  });

  it("fetchOne calls validate with where and adapter.fetchAll with where, offset", function (done) {

    var service = new Framework.Services.Model({
        adapter: new Framework.Adapters.Model.Mysql({
          pool: {},
          primary: ["id"],
          table: "table"
        }),
        validators: {
          add: new Framework.Validators.Object()
        }
      }),
      where = "where",
      offset = "offset",
      model = "model",
      mock = new Framework.Mock();

    mock.mock("service", service, "validate")
      .with("fetchOne", where)
      .resolve(where);

    mock.mock("adapter", service.adapter, "fetchOne")
      .with(where, offset)
      .resolve(model);

    service.fetchOne(where, offset)
      .then(function (result) {

        Framework.Expect(result).to.be.equal(model);

        return mock.done(done);

      })
      .catch(done);

  });

  it("validate with validator and calls validator.validate", function (done) {

    var service = new Framework.Services.Model({
        adapter: new Framework.Adapters.Model.Mysql({
          pool: {},
          primary: ["id"],
          table: "table"
        }),
        validators: {
          add: new Framework.Validators.Object()
        }
      }),
      key = "add",
      value = "value",
      mock = new Framework.Mock();

    mock.mock("service", service.validators.add, "validate")
      .with(value, value)
      .resolve(value);

    service.validate(key, value)
      .then(function (result) {

        Framework.Expect(result).to.be.equal(value);

        return mock.done(done);

      })
      .catch(done);

  });

  it("validate without validator resolves value", function (done) {

    var service = new Framework.Services.Model({
        adapter: new Framework.Adapters.Model.Mysql({
          pool: {},
          primary: ["id"],
          table: "table"
        }),
        validators: {}
      }),
      key = "add",
      value = "value",
      mock = new Framework.Mock();

    service.validate(key, value)
      .then(function (result) {

        Framework.Expect(result).to.be.equal(value);

        return mock.done(done);

      })
      .catch(done);

  });

});
