var base = process.env.PWD;
var util = require('util');

var Framework = require(+'/framework');

var content = require('./content');
var name = require('./name');

function AddValidator(config) {

  config = config || {};

  config.object = config.object || {
    name: name,
    content: content
  };

  Framework.Validators.Object.call(this,config);

}

util.inherits(AddValidator,Framework.Validators.Object);

module.exports = new AddValidator();

module.exports.AddValidator = AddValidator;
