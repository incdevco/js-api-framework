var AWS = require("../aws");
var Expect = require("../expect");
var Promise = require("../promise");

function Queue(config) {
  "use strict";

  Expect(config).to.be.an("object", "config");

  if (config.delaySeconds) {

    Expect(config.delaySeconds).to.be.a("number", "config.delaySeconds");

  }

  if (config.maxNumberOfMessages) {

    Expect(config.maxNumberOfMessages).to.be.a("number", "config.maxNumberOfMessages");

  }

  Expect(config.name).to.be.a("string", "config.name");
  Expect(config.region).to.be.a("string", "config.region");

  if (config.sqs) {

    Expect(config.sqs).to.be.an.instanceof(AWS.SQS);

  }

  Expect(config.url).to.be.a("string", "config.url");

  if (config.visibilityTimeout) {

    Expect(config.visibilityTimeout).to.be.a("number", "config.visibilityTimeout");

  }

  this.delaySeconds = config.delaySeconds || 0;
  this.maxNumberOfMessages = config.maxNumberOfMessages || 1;
  this.name = config.name;
  this.region = config.region;
  this.sqs = config.sqs || new AWS.SQS({
    region: this.region
  });
  this.url = config.url;
  this.visibilityTimeout = config.visibilityTimeout || 60;

}

Queue.prototype.createQueue = function createQueue() {
  "use strict";

  var self = this;

  return new Promise(function (resolve, reject) {

    return self.sqs.createQueue({
      QueueName: self.name
    }, function (error, data) {

      if (error) {

        return reject(error);

      }

      return resolve(data);

    });

  });

};

Queue.prototype.dequeue = function dequeue(message) {
  "use strict";

  var self = this;

  return new Promise(function (resolve, reject) {

    return self.sqs.deleteMessage({
      QueueUrl: self.url,
      ReceiptHandle: message.ReceiptHandle
    }, function (error, data) {

      if (error) {

        return reject(error);

      } else {

        return resolve(data);

      }

    });

  });

};

Queue.prototype.deleteQueue = function deleteQueue() {
  "use strict";

  var self = this;

  return new Promise(function (resolve, reject) {

    return self.sqs.deleteQueue({
      QueueUrl: self.url
    }, function (error, data) {

      if (error) {

        return reject(error);

      }

      return resolve(data);

    });

  });

};

Queue.prototype.enqueue = function enqueue(message) {
  "use strict";

  var self = this;

  return new Promise(function (resolve, reject) {

    var body = JSON.stringify(message);

    // TODO Verify AWS got the correct message with md5 hash

    return self.sqs.sendMessage({
      DelaySeconds: self.delaySeconds,
      MessageBody: body,
      QueueUrl: self.url
    }, function (error, data) {

      if (error) {

        return reject(error);

      } else {

        return resolve({
          MessageId: data.MessageId,
          MessageBody: body
        });

      }

    });

  });

};

Queue.prototype.receive = function receive(params) {
  "use strict";

  var self = this;

  params = params || {};

  params.QueueUrl = params.QueueUrl || this.url;
  params.MaxNumberOfMessages = params.MaxNumberOfMessages || this.maxNumberOfMessages;
  params.VisibilityTimeout = params.VisibilityTimeout || this.visibilityTimeout;

  return new Promise(function (resolve, reject) {

    return self.sqs.receiveMessage(params, function (error, data) {

      if (error) {

        return reject(error);

      } else {

        return resolve(data.Messages || []);

      }

    });

  });

};

module.exports = Queue;
