var AWS = require("../aws");
var Expect = require("../expect");
var Promise = require("../promise");

function SQS(config) {
  "use strict";

  Expect(config).to.be.an("object");
  Expect(config.queueUrl).to.be.a("string");

  this.queueUrl = config.queueUrl;
  this.sqs = config.sqs || new AWS.SQS();

}

SQS.prototype.sendMessage = function sendMessage(params) {
  "use strict";

  var sqs = this.sqs;

  params.QueueUrl = params.QueueUrl || this.queueUrl;

  return new Promise(function (resolve, reject) {

    return sqs.sendMessage(params, function (error, data) {

      if (error) {

        return reject(error);

      }

      return resolve(data);

    });

  });

};

module.exports = SQS;
