var base = process.env.PWD;

var Framework = require(+'/framework');

describe('Framework.Validators.String',function () {

  it('validate resolves with string',function (done) {

    var validator = new Framework.Validators.String();

    validator.validate('test')
      .then(function () {

        return done();

      })
      .catch(done);

  });

  it('validate resolves with null',function (done) {

    var validator = new Framework.Validators.String();

    validator.validate(null)
      .then(function () {

        return done();

      })
      .catch(done);

  });

  it('validate resolves with undefined',function (done) {

    var validator = new Framework.Validators.String();

    validator.validate(undefined)
      .then(function () {

        return done();

      })
      .catch(done);

  });

  it('validate resolves with string and validator',function (done) {

    var validator = new Framework.Validators.String({
      validators: [
        new Framework.Validators.Length({
          max: 5,
          min: 5
        })
      ]
    });

    validator.validate('teste')
      .then(function () {

        return done();

      })
      .catch(done);

  });

  it('validate rejects with string and validator',function (done) {

    var validator = new Framework.Validators.String({
      validators: [
        new Framework.Validators.Length({
          max: 10,
          min: 10
        })
      ]
    });

    validator.validate('test')
      .then(function () {

        return done(new Error('resolved'));

      })
      .catch(Framework.Errors.NotValid,function () {

        return done();

      })
      .catch(done);

  });

  it('validate rejects with number',function (done) {

    var validator = new Framework.Validators.String();

    validator.validate(12345)
      .then(function () {

        return done(new Error('resolved'));

      })
      .catch(Framework.Errors.NotValid,function () {

        return done();

      })
      .catch(done);

  });

  it('validate rejects when required and null',function (done) {

    var validator = new Framework.Validators.String({
      required: true
    });

    validator.validate(null)
      .then(function () {

        return done(new Error('resolved'));

      })
      .catch(Framework.Errors.NotValid,function () {

        return done();

      })
      .catch(done);

  });

  it('validate rejects when required and undefined',function (done) {

    var validator = new Framework.Validators.String({
      required: true
    });

    validator.validate(undefined)
      .then(function () {

        return done(new Error('resolved'));

      })
      .catch(Framework.Errors.NotValid,function () {

        return done();

      })
      .catch(done);

  });

});
