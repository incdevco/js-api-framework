var AWS = require("../aws");
var Expect = require("../expect");
var Promise = require("../promise");

function DynamoDB(config) {
  "use strict";

  Expect(config).to.be.an("object", "config");

  Expect(config.attributeDefinitions).to.be.an("array", "config.attributeDefinitions");

  if (config.ddb) {

    Expect(config.ddb).to.be.an.instanceof(AWS.DynamoDB);

  }

  Expect(config.keySchema).to.be.an("array", "config.keySchema");
  Expect(config.provisionedThroughput).to.be.an("object", "config.provisionedThroughput");
  Expect(config.provisionedThroughput.ReadCapacityUnits).to.be.an("number", "config.provisionedThroughput.ReadCapacityUnits");
  Expect(config.provisionedThroughput.WriteCapacityUnits).to.be.an("number", "config.provisionedThroughput.WriteCapacityUnits");
  Expect(config.region).to.be.a("string", "config.region");
  Expect(config.tableName).to.be.a("string", "config.tableName");

  this.attributeDefinitions = config.attributeDefinitions;
  this.ddb = config.ddb || new AWS.DynamoDB({
    region: config.region
  });
  this.keySchema = config.keySchema;
  this.provisionedThroughput = config.provisionedThroughput;
  this.region = config.region;
  this.tableName = config.tableName;

}

DynamoDB.prototype.arrayToAttributeValue = function arrayToAttributeValue(array) {
  "use strict";

  var attribute = new Array(array.length),
    self = this;

  array.forEach(function (item, index) {

    switch (typeof item) {

      case "boolean":

        attribute[index] = self.booleanToAttributeValue(item);

        break;

      case "number":

        attribute[index] = self.numberToAttributeValue(item);

        break;

      case "object":

        attribute[index] = self.objectToAttributeValue(item);

        break;

      case "string":

        attribute[index] = self.stringToAttributeValue(item);

        break;

      default:

    }

  });

  return {
    L: attribute
  };

};

DynamoDB.prototype.booleanToAttributeValue = function booleanToAttributeValue(value) {
  "use strict";

  return {
    BOOL: (value) ? true : false
  };

};

DynamoDB.prototype.createTable = function createTable() {
  "use strict";

  var self = this;

  return new Promise(function (resolve, reject) {

    return self.ddb.createTable({
      AttributeDefinitions: self.attributeDefinitions,
      KeySchema: self.keySchema,
      ProvisionedThroughput: self.provisionedThroughput,
      TableName: self.tableName
    }, function (error, data) {

      if (error) {

        return reject(error);

      } else {

        return resolve(data);

      }

    });

  });

};

DynamoDB.prototype.dataToItem = function dataToItem(data) {
  "use strict";

  var item = {}, self = this;

  Object.keys(data).forEach(function (key) {

    var result;

    switch (typeof data[key]) {

      case "boolean":

        result = self.booleanToAttributeValue(data[key]);

        break;

      case "number":

        result = self.numberToAttributeValue(data[key]);

        break;

      case "object":

        result = self.objectToAttributeValue(data[key]);

        break;

      case "string":

        result = self.stringToAttributeValue(data[key]);

        break;

      default:

    }

    if (result) {

      item[key] = result;

    }

  });

  return item;

};

DynamoDB.prototype.deleteTable = function deleteTable() {
  "use strict";

  var self = this;

  return new Promise(function (resolve, reject) {

    return self.ddb.deleteTable({
      TableName: self.tableName
    }, function (error, data) {

      if (error) {

        return reject(error);

      } else {

        return resolve(data);

      }

    });

  });

};

DynamoDB.prototype.get = function get(where, consistentRead) {
  "use strict";

  var self = this;

  return new Promise(function (resolve, reject) {

    var key = {};

    self.attributeDefinitions.forEach(function (attribute) {

      var name = attribute.AttributeName;

      if (where[name]) {

        switch (attribute.AttributeType) {

          case "S":

            key[name] = self.stringToAttributeValue(where[name]);

            break;

          case "N":

            key[name] = self.numberToAttributeValue(where[name]);

            break;

          default:

        }

      }

    });

    return self.ddb.getItem({
      ConsistentRead: consistentRead,
      Key: key,
      TableName: self.tableName
    }, function (error, data) {

      if (error) {

        return reject(error);

      } else {

        return resolve(self.itemToData(data.Item));

      }

    });

  });

};

DynamoDB.prototype.itemToData = function itemToData(item) {
  "use strict";

  if (item) {

    var data = {};

    Object.keys(item).forEach(function (key) {

      if (item[key].S) {

        data[key] = item[key].S;

      } else if (item[key].N) {

        data[key] = parseFloat(item[key].N);

      }

    });

    return data;

  } else {

    return null;

  }

};

DynamoDB.prototype.numberToAttributeValue = function numberToAttributeValue(value) {
  "use strict";

  return {
    N: value.toString()
  };

};

DynamoDB.prototype.objectToAttributeValue = function objectToAttributeValue(value) {
  "use strict";

  if (Array.isArray(value)) {

    return this.arrayToAttributeValue(value);

  } else {

    var attribute = {}, self = this;

    Object.keys(value).forEach(function (key) {

      switch (typeof value[key]) {

        case "boolean":

          attribute[key] = self.booleanToAttributeValue(value[key]);

          break;

        case "number":

          attribute[key] = self.numberToAttributeValue(value[key]);

          break;

        case "object":

          attribute[key] = self.objectToAttributeValue(value[key]);

          break;

        case "string":

          attribute[key] = self.stringToAttributeValue(value[key]);

          break;

        default:

      }

    });

    return {
      M: attribute
    };

  }

};

DynamoDB.prototype.put = function put(data) {
  "use strict";

  var self = this;

  return new Promise(function (resolve, reject) {

    console.log("put", data);

    return self.ddb.putItem({
      Item: self.dataToItem(data),
      TableName: self.tableName
    }, function (error) {

      if (error) {

        return reject(error);

      } else {

        return resolve(data);

      }

    });

  });

};

DynamoDB.prototype.queueMessageToItem = function (message) {
  "use strict";

  console.log("queueMessageToItem", message);

  return {
    body: message.MessageBody || message.Body,
    id: message.MessageId,
    status: "Queued"
  };

};

DynamoDB.prototype.stringToAttributeValue = function stringToAttributeValue(value) {
  "use strict";

  return {
    S: value
  };

};

module.exports = DynamoDB;
