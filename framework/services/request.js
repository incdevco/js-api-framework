var http = require("http");
var merge = require("object-merge");

var Promise = require("../promise");

function RequestService(config) {
  "use strict";

  config = config || {};

  this.headers = config.headers || {};
  this.hostname = config.hostname;
  this.port = config.port;

}

RequestService.prototype.makeRequest = function makeRequest(options, data) {
  "use strict";

  options.headers = merge(options.headers, this.headers);
  options.hostname = options.hostname || this.hostname;
  options.port = options.port || this.port;

  return new Promise(function (resolve, reject) {

    var request;

    request = http.request(options, function (response) {

      response.body = "";

      response.setEncoding("utf8");

      response.on("data", function (chunk) {

        response.body += chunk;

      });

      response.on("end", function () {

        return resolve(response);

      });

    });

    request.on("error", function (error) {

      return reject(error);

    });

    if (data) {

      request.write(data);

    }

    return request.end();

  });

};

module.exports = RequestService;
