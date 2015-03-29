var nodemailer = require('../index').NodeMailer;
var Promise = require('../index').Promise;

function EmailService(config) {

  config = config || {};

  this.config = config.config || {};
  this.defaults = config.defaults || {};
  this.transport = config.transport || nodemailer.createTransport(config.config);

}

EmailService.prototype.send = function send(email) {

  var service = this;

  Object.keys(service.defaults).forEach(function (key) {

    email[key] = email[key] || service.defaults[key];

  });

  return new Promise(function (resolve,reject) {

    return service.transport.sendEmail(email,function (error,result) {

      if (error) {

        return reject(error);

      }

      return resolve(result);

    });

  });

};

module.exports = EmailService;
