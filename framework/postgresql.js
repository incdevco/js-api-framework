module.exports = require('pg');

module.exports.types.setTypeParser(16,function booleanParser(value) {

  console.log('booleanParser',value);

  return value;

});

module.exports.types.setTypeParser(20,function bigintegerParser(value) {

  return parseInt(value);

});

module.exports.types.setTypeParser(1700,function numericParser(value) {

  return parseFloat(value);

});
