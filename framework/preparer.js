var Expect = require('./expect');
var Promise = require('./promise');

function Preparer(config) {

  config = config || {};

}

Preparer.prototype.prepareModel = function prepareModel(model) {

  return Promise.resolve(model);

};

Preparer.prototype.prepareSet = function prepareSet(set) {

  var preparer = this, promises;

  Expect(set).to.be.instanceof(Array);

  promises = new Array(set.length);

  set.forEach(function (model,index) {

    promises[index] = preparer.prepareModel(model);

  });

  return Promise.all(promises)
    .then(function () {

      return set;

    });

};

module.exports = Preparer;
