var base = process.env.PWD;
var util = require('util');

var Framework = require(base+'/framework');

function NameValidator(config) {

  config = config || {};

  config.required = config.required || true;
  
  config.validators = config.validators || [
    new Framework.Validators.Length({
      max: 255,
      min: 1
    })
  ];

  Framework.Validators.String.call(this,config);

}

util.inherits(NameValidator,Framework.Validators.String);

module.exports = new NameValidator();

module.exports.NameValidator = NameValidator;
