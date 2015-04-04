var base = process.env.PWD;

var Framework = require(base+'/framework');

describe('Framework.Services.Email',function () {

  it('constructor',function () {

    var service = new Framework.Services.Email({
      config: {},
      defaults: {}
    });

  });

  it('send with defaults resolves with result from transport.sendEmail',function (done) {

    var service = new Framework.Services.Email({
        defaults: {
          from: 'from',
          subject: 'subject'
        },
        transport: {}
      }),
      email = {
        to: 'to'
      },
      expected = 'expected',
      mock = new Framework.Mock();

    mock.mock('transport',service.transport,'sendEmail')
      .with({
        from: 'from',
        to: 'to',
        subject: 'subject'
      })
      .callback(null,expected);

    service.send(email)
      .then(function (actual) {

        Framework.Expect(actual).to.be.equal(expected);

        return mock.done(done);

      })
      .catch(done);

  });

  it('send rejects with error from transport.sendEmail',function (done) {

    var service = new Framework.Services.Email({
        defaults: {
          from: 'from',
          subject: 'subject'
        },
        transport: {}
      }),
      email = {
        to: 'to'
      },
      error = 'error',
      mock = new Framework.Mock();

    mock.mock('transport',service.transport,'sendEmail')
      .with({
        from: 'from',
        to: 'to',
        subject: 'subject'
      })
      .callback(error);

    service.send(email)
      .then(function (actual) {

        return done(new Error('resolved'));

      })
      .catch(function (actual) {

        Framework.Expect(actual).to.be.equal(error);

        return done();

      });

  });

});
