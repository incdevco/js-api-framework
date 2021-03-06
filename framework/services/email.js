var env = process.env.NODE_ENV || "development";

var Expect = require("../expect");
var NodeMailer = require("../node-mailer");
var Promise = require("../promise");

function EmailService(config) {
  "use strict";

  Expect(config).to.be.an("object", "config");

  if (config.defaults) {

    Expect(config.defaults).to.be.an("object", "config.defaults");

  }

  if (config.transport) {

    Expect(config.transport).to.be.an("object", "config.transport");

  } else {

    Expect(config.config).to.be.an("object", "config.config");

  }

  this.config = config.config || {};
  this.defaults = config.defaults || {};
  this.transport = config.transport || NodeMailer.createTransport(config.config);

}

EmailService.prototype.send = function send(email) {
  "use strict";

  var service = this;

  Object.keys(service.defaults).forEach(function (key) {

    email[key] = email[key] || service.defaults[key];

  });

  return new Promise(function (resolve, reject) {

    return service.transport.sendEmail(email, function (error, result) {

      if (error) {

        return reject(error);

      }

      return resolve(result);

    });

  });

};

module.exports = EmailService;
