var AWS = require("../aws");
var expect = require("../expect");
var Promise = require("../promise");

function SQS(config) {
  "use strict";

  config = config || {};

  expect(config.maxMessages).to.be.a("number", "config.maxMessages");
  expect(config.queueUrl).to.be.a("string", "config.queueUrl");
  expect(config.visibilityTimeout).to.be.a("number", "config.visibilityTimeout");
  expect(config.waitTimeout).to.be.a("number", "config.waitTimeout");

  this.maxMessages = config.maxMessages;
  this.queueUrl = config.queueUrl;
  this.sqs = config.sqs || new AWS.SQS();
  this.visibilityTimeout = config.visibilityTimeout;
  this.waitTimeout = config.waitTimeout;

}

SQS.prototype.deleteMessage = function deleteMessage(message) {
  "use strict";

  var worker = this;

  return new Promise(function (resolve, reject) {

    return worker.sqs.deleteMessage({
      QueueUrl: worker.queueUrl,
      ReceiptHandle: message.ReceiptHandle
    }, function (error, data) {

      if (error) {

        return reject(error);

      }

      return resolve(data);

    });

  });

};

SQS.prototype.poll = function poll() {
  "use strict";

  var worker = this;

  this.sqs.receiveMessage({
    QueueUrl: this.queueUrl,
    MaxNumberOfMessages: this.maxMessages,
    VisibilityTimeout: this.visibilityTimeout,
    WaitTimeSeconds: this.waitTimeout
  }, function (error, response) {

    if (error) {

      console.error(error);

      return false;

    }

    if (response.Messages && response.Messages.length) {

      var promises = new Array(response.Messages.length);

      response.Messages.forEach(function (message, index) {

        promises[index] = worker.handleMessage(message)
          .then(function () {

            return worker.deleteMessage(message);

          }, function (error) {

            console.error("message error");
            console.error(error);

            return true;

          });

      });

      return Promise.all(promises)
        .then(function ( ) {

          return worker.poll();

        });

    }

    return worker.poll();

  });

};

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
