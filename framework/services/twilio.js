var env = process.env.NODE_ENV || "production";
var twilio = require("twilio");

var Expect = require("../expect");
var Promise = require("../promise");

function Service(config) {
  "use strict";

  Expect(config).to.be.an("object", "config");

  if (config.twilio) {

    Expect(config.twilio).to.be.an("object", "config.twilio");

  } else {

    Expect(config.account_sid).to.be.an("string", "config.account_id");

    Expect(config.auth_token).to.be.an("string", "config.auth_token");

  }

  this.twilio = config.twilio || twilio(config.account_sid, config.auth_token);

}

Service.prototype.getMessage = function (messageSid) {
  "use strict";

  var self = this;

  return new Promise(function (resolve, reject) {

    return self.twilio.messages(messageSid).get(function (exception, result) {

      if (exception) {

        return reject(exception);

      } else {

        return resolve(result);

      }

    });

  });

};

Service.prototype.makeCall = function (call) {
  "use strict";

  var self = this;

  return new Promise(function (resolve, reject) {

    if (env === "production") {

      return self.twilio.makeCall(call, function (exception, result) {

        if (exception) {

          return reject(exception);

        }

        return resolve(result);

      });

    } else {

      return resolve({
        sid: "12345678990",
        status: "queued",
        from: call.from,
        to: call.to,
        direction: "outbound"
      });

    }

  });

};

Service.prototype.sendMessage = function (message) {
  "use strict";

  var self = this;

  return new Promise(function (resolve, reject) {

    if (env === "production") {

      return self.twilio.sendMessage(message, function (exception, result) {

        if (exception) {

          return reject(exception);

        }

        return resolve(result);

      });

    } else {

      return resolve({
        sid: "12345678990",
        status: "queued",
        from: message.from,
        to: message.to,
        body: message.body,
        direction: "outbound-api"
      });

    }

  });

};

module.exports = Service;
