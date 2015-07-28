var base = process.env.PWD;

var Framework = require(+'/framework');

describe('Framework.Validators.Array',function () {

  it('constructor',function () {

    var validator = new Framework.Validators.Array();

  });

  it('validate with array and item validators resolves with value',function (done) {

    var validator,
      arrayValidator = {},
      itemValidator = {},
      mock = new Framework.Mock(),
      value = ['item'];

    mock.mock('arrayValidator',arrayValidator,'validate')
      .with(value,value)
      .resolve(value);

    mock.mock('itemValidator',itemValidator,'validate')
      .with(value[0],value)
      .resolve(true);

    validator = new Framework.Validators.Array({
       array: [arrayValidator],
       item: [itemValidator]
     });

    validator.validate(value,value)
      .then(function (actual) {

        Framework.Expect(actual).to.be.eql(value);

        return mock.done(done);

      })
      .catch(done);

  });

  it('validate with array and item validators rejects',function (done) {

    var validator,
      arrayValidator = {},
      itemValidator = {},
      mock = new Framework.Mock(),
      value = ['item'];

    mock.mock('arrayValidator',arrayValidator,'validate')
      .with(value,value)
      .reject(new Framework.Errors.NotValid('array_error'));

    mock.mock('itemValidator',itemValidator,'validate')
      .with(value[0],value)
      .reject(new Framework.Errors.NotValid('item_error'));

    validator = new Framework.Validators.Array({
       array: [arrayValidator],
       item: [itemValidator]
     });

    validator.validate(value,value)
      .then(function (actual) {

        return done(new Error('resolved'));

      })
      .catch(Framework.Errors.NotValid,function (error) {

        Framework.Expect(error).to.be.eql({
          errors: {
            array: [
              'array_error'
            ],
            item: [
              ['item_error']
            ]
          },
          name: 'NotValid'
        });

        return mock.done(done);

      })
      .catch(done);

  });

  it('validate rejects when value is not Array',function (done) {

    var validator,
      value = 'item';

    validator = new Framework.Validators.Array();

    validator.validate(value,value)
      .then(function (actual) {

        return done(new Error('resolved'));

      })
      .catch(Framework.Errors.NotValid,function (error) {

        Framework.Expect(error).to.be.eql({
          errors: 'Must Be An Array',
          name: 'NotValid'
        });

        return done();

      })
      .catch(done);

  });

});
