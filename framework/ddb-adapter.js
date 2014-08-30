var DynamoDB = require('./dynamodb');

module.exports = function DDBAdapter(table,key,attributes,dynamodb) {
	"use strict";
	dynamodb = dynamodb || new DynamoDB();
	this.ddb = dynamodb;
	this.delete = function (clean) {
		return this.ddb.delete(table,{
			id: {'S': clean.id}
		});
	};
	this.fetchAll = function () {
		return this.ddb.fetchAll(table);
	};
	this.fetchOne = function (clean) {
		return this.ddb.fetchOne(table,{
			id: {'S': clean.id}
		});
	};
	this.put = function (clean) {
		return this.ddb.put(table,clean,attributes);
	};
};