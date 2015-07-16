var env = process.env.NODE_ENV || "development";
var Errors = require("../errors");

module.exports = function errorHandler() {
  "use strict";

  return function middleware(error, request, response, next) {

    var json = {
      message: error.message
    };

    if (error instanceof Errors.NotAllowed) {

      response.status(403);

      json.resource = error.resource;
      json.privilege = error.privilege;

    } else if (error instanceof Errors.NotValid) {

      response.status(400);

      json.errors = error.errors;

    } else if (error instanceof Errors.NotFound) {

      response.status(404);

    } else {

      response.status(500);

    }

    if (env !== "production") {

      console.error(error, error.stack);

    }

    response.json(json);

    return true;

  };

};
