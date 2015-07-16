var Acl = require("../acl");
var Errors = require("../errors");
var Expect = require("../expect");

function Service(config) {
  "use strict";

  Expect(config).to.be.an("object", "config");
  Expect(config.acl).to.be.an.instanceof(Acl, "config.acl");
  Expect(config.resource).to.be.a("string", "config.resource");

  this.acl = config.acl;
  this.resource = config.resource;

}

Service.prototype.isAllowed = function isAllowed(privilege, context, request) {
  "use strict";

  return this.acl.isAllowed(request.user, this.resource, privilege, context);

};

Service.prototype.isAllowedSet = function isAllowedSet(privilege, context, request) {
  "use strict";

  var allowed = [], promises = [], self = this;

  Expect(context).to.be.an("array");

  context.forEach(function (item) {

    promises.push(self.acl.isAllowed(request.user, self.resource, privilege, item)
      .then(function () {

        allowed.push(item);

      })
      .catch(Errors.NotAllowed, function () {

        return true;

      }));

  });

  return Promise.all(promises)
    .then(function () {

      return allowed;

    });

};

module.exports = Service;
