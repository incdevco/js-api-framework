var base = process.env.PWD;

var Framework = require(+'/framework');

describe('Framework.Validators.Number',function () {

  it('validate resolves with number',function (done) {

    var validator = new Framework.Validators.Number();

    validator.validate(12345)
      .then(function () {

        return done();

      })
      .catch(done);

  });

  it('validate resolves with number and validator',function (done) {

    var validator = new Framework.Validators.Number({
      validators: [
        new Framework.Validators.Length({
          max: 5,
          min: 5
        })
      ]
    });

    validator.validate(12345)
      .then(function () {

        return done();

      })
      .catch(done);

  });

  it('validate rejects with number and validator',function (done) {

    var validator = new Framework.Validators.Number({
      validators: [
        new Framework.Validators.Length({
          max: 10,
          min: 10
        })
      ]
    });

    validator.validate(12345)
      .then(function () {

        return done(new Error('resolved'));

      })
      .catch(Framework.Errors.NotValid,function () {

        return done();

      })
      .catch(done);

  });

  it('validate rejects with string',function (done) {

    var validator = new Framework.Validators.Number();

    validator.validate('test')
      .then(function () {

        return done(new Error('resolved'));

      })
      .catch(Framework.Errors.NotValid,function () {

        return done();

      })
      .catch(done);

  });

});
