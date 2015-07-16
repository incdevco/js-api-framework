var Expect = require("../expect");
var Promise = require("../promise");
var Services = require("../services");

function Worker(config) {
  "use strict";

  config = config || {};

  if (config.maxNumberOfMessages) {

    Expect(config.maxNumberOfMessages).to.be.a("number", "config.maxNumberOfMessages");

  }

  Expect(config.queue).to.be.an.instanceof(Services.Queue, "config.queue");

  if (config.visibilityTimeout) {

    Expect(config.visibilityTimeout).to.be.a("number", "config.visibilityTimeout");

  }

  if (config.waitTimeSeconds) {

    Expect(config.waitTimeSeconds).to.be.a("number", "config.waitTimeSeconds");

  }

  this.maxNumberOfMessages = config.maxNumberOfMessages || 1;
  this.queue = config.queue;
  this.stopped = false;
  this.visibilityTimeout = config.visibilityTimeout || 20;
  this.waitTimeSeconds = config.waitTimeSeconds || 20;

}

Worker.prototype.getMessageFromDdb = function getMessageFromDdb(message) {
  "use strict";

  var self = this;

  return self.ddb.get({
    id: message.MessageId
  })
    .then(function (item) {

      if (item) {

        return item;

      } else {

        item = self.ddb.queueMessageToItem(message);

        return self.ddb.put(item);

      }

    });

};

Worker.prototype.poll = function poll() {
  "use strict";

  var worker = this;

  if (typeof this.process !== "function") {

    return Promise.reject("this.process must be a function");

  }

  console.log("starting poll");

  return this.queue.receive({
    MaxNumberOfMessages: this.maxNumberOfMessages,
    VisibilityTimeout: this.visibilityTimeout,
    WaitTimeSeconds: this.waitTimeSeconds
  })
    .then(function (messages) {

      var promises = new Array(messages.length);

      console.log("received %s messages", messages.length);

      messages.forEach(function (message, index) {

        promises[index] = worker.process(message);

      });

      return Promise.all(promises);

    })
    .then(function () {

      console.log("finished poll");

      if (worker.stopped) {

        return true;

      }

      return worker.poll();

    });

};

Worker.prototype.start = function start() {
  "use strict";

  console.log("Starting Worker");

  this.stopped = false;

  return this.poll();

};

Worker.prototype.stop = function stop() {
  "use strict";

  console.log("Stopping Worker");

  this.stopped = true;

  return true;

};

module.exports = Worker;
