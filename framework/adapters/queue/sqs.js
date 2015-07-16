var AWS = require("../../aws");
var Promise = require("../../promise");

function Adapter(config) {
  "use strict";

  config = config || {};

  this.name = config.name;
  this.sqs = config.sqs || new AWS.SQS();
  this.url = config.url;

}

Adapter.prototype.createQueue = function createQueue() {
  "use strict";

  var adapter = this;

  return new Promise(function (resolve, reject) {

    return adapter.sqs.createQueue({
      QueueName: adapter.name
    }, function (error, data) {

      if (error) {

        return reject(error);

      }

      return resolve(data);

    });

  });

};

Adapter.prototype.delete = function _delete(message) {
  "use strict";

  var adapter = this;

  return new Promise(function (resolve, reject) {

    return adapter.sqs.deleteMessage({
      QueueUrl: adapter.url,
      ReceiptHandle: message.ReceiptHandle
    }, function (error, data) {

      if (error) {

        return reject(error);

      }

      return resolve(data);

    });

  });

};

Adapter.prototype.deleteQueue = function deleteQueue() {
  "use strict";

  var adapter = this;

  return new Promise(function (resolve, reject) {

    return adapter.sqs.deleteQueue({
      QueueUrl: adapter.url
    }, function (error, data) {

      if (error) {

        return reject(error);

      }

      return resolve(data);

    });

  });

};

Adapter.prototype.receive = function receive(params) {
  "use strict";

  var adapter = this;

  return new Promise(function (resolve, reject) {

    return adapter.sqs.receiveMessage(params, function (error, response) {

      if (error) {

        return reject(error);

      }

      return resolve(response.Messages);

    });

  });

};

Adapter.prototype.send = function send(message, params) {
  "use strict";

  var adapter = this;

  params = params || {};

  params.MessageBody = JSON.stringify(message);
  params.QueueUrl = params.QueueUrl || this.url;

  return new Promise(function (resolve, reject) {

    return adapter.sqs.sendMessage(params, function (error, data) {

      if (error) {

        return reject(error);

      }

      return resolve(data);

    });

  });

};

module.exports = Adapter;
