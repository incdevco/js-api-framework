var base = process.env.PWD;

var Framework = require(+'/framework');

describe('Framework.Validators.Boolean',function () {

  it('validate resolves with boolean',function (done) {

    var validator = new Framework.Validators.Boolean();

    validator.validate(true)
      .then(function () {

        return done();

      })
      .catch(done);

  });

  it('validate rejects with string',function (done) {

    var validator = new Framework.Validators.Boolean();

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
