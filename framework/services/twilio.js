var env = process.env.NODE_ENV || 'production';
var twilio = require('twilio');

var Expect = require('../expect');
var Promise = require('../promise');

function TwilioService(config) {

  Expect(config).to.be.an('object','config');

  if (config.twilio) {

    Expect(config.twilio).to.be.an('object','config.twilio');

  } else {

    Expect(config.account_sid).to.be.an('string','config.account_id');

    Expect(config.auth_token).to.be.an('string','config.auth_token');

  }

  this.twilio = config.twilio || twilio(config.account_sid,config.auth_token);

}

TwilioService.prototype.makeCall = function makeCall(call) {

  var twilio = this.twilio;

  return new Promise(function (resolve,reject) {

    if (env === 'production') {

      return twilio.makeCall(call,function (error,response) {

        if (error) {

          return reject(error);

        }

        return resolve(response);

      });

    } else {

      console.log('TwilioService.makeCall',call);

      return resolve({
        sid: '12345678990',
        status: 'queued',
        from: call.from,
        to: call.to,
        direction: 'outbound'
      });

    }

  });

};

TwilioService.prototype.sendMessage = function sendMessage(message) {

  var twilio = this.twilio;

  return new Promise(function (resolve,reject) {

    if (env === 'production') {

      return twilio.sendMessage(message,function (error,response) {

        if (error) {

          return reject(error);

        }

        return resolve(response);

      });

    } else {

      console.log('TwilioService.sendMessage',message);

      return resolve({
        sid: '12345678990',
        status: 'queued',
        from: message.from,
        to: message.to,
        body: message.body,
        direction: 'outbound-api'
      });

    }

  });

};

module.exports = TwilioService;
