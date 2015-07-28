var chai = require("chai");

chai.config.includeStack = true;
chai.config.showDiff = true;
chai.config.truncateThreshold = 0;

module.exports = chai.expect;
