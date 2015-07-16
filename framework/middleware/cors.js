
module.exports = function cors(config) {
  "use strict";

  config = config || {};

  return function middleware(request, response, next) {

    var origin = request.header("Origin");

    if (config.origins.indexOf(origin)) {

      response.header("Access-Control-Allow-Origin", origin);

    }

    response.header("Access-Control-Allow-Headers", config.headers.join(", "));
    response.header("Access-Control-Allow-Methods", config.methods.join(", "));

    return next();

  };

};
