var AWS = require('aws-sdk');
var q = require('q');
AWS.config.update({
	"accessKeyId": "AKIAJICR3F2FUKJOSELQ",
	"secretAccessKey": "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",
	"region": "us-west-1"
});

module.exports = function DynamoDB(awsddb) {
	"use strict";
	awsddb = awsddb || new AWS.DynamoDB({
		"endpoint": "http://localhost:8000"
	});
	this.delete = function (table,key) {
		var deferred = q.defer();
		awsddb.deleteItem({
			TableName: table,
			Key: key
		},function (err,data) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve(data);
			}
		});
		return deferred.promise;
	};
	this.fetchAll = function (table) {
		var deferred = q.defer(),
			jsons = [],
			that = this;
		awsddb.scan({
			TableName: table
		},function (err,data) {
			if (err) {
				deferred.reject(err);
			} else {
				for (var i in data.Items) {
					jsons.push(that.itemToJson(data.Items[i]));
				}
				deferred.resolve(jsons);
			}
		});
		return deferred.promise;
	};
	this.fetchOne = function (table,key) {
		var deferred = q.defer(),
			that = this;
		awsddb.getItem({
				TableName: table,
				Key: key
			},function (err,data) {
			if (err) {
				deferred.reject(err);
			} else {
				if ('Item' in data) {
					deferred.resolve(that.itemToJson(data.Item));
				} else {
					deferred.reject('Nothing Found');
				}
			}
		});
		return deferred.promise;
	};
	this.fetchQuery = function (table,keyConditions,indexName) {
		var deferred = q.defer(),
			jsons = [],
			that = this;
		awsddb.query({
			TableName: table,
			KeyConditions: keyConditions,
			IndexName: indexName
		},function (err,data) {
			if (err) {
				deferred.reject(err);
			} else {
				for (var i in data.Items) {
					jsons.push(that.itemToJson(data.Items[i]));
				}
				deferred.resolve(jsons);
			}
		});
		return deferred.promise;
	};
	this.itemToJson = function (item,attributes) {
		var json = {};
		if ('Item' in item) {
			item = item.Item;
		}
		for (var i in item) {
			for (var t in item[i]) {
				switch (t) {
					case 'S':
						json[i] = item[i][t];
					break;
					case 'N':
						json[i] = parseFloat(item[i][t]);
					break;
				}
			}
		}
		return json;
	};
	this.jsonToItem = function (json,attributes) {
		var item = {},
			attribute = {};
		for (var k in attributes) {
			if (json[k] !== undefined) {
				attribute = {};
				attribute[attributes[k]] = json[k].toString();
				item[k] = attribute;
			}
		}
		return item;
	};
	this.put = function (table,json,attributes) {
		var deferred = q.defer();
		awsddb.putItem({
			TableName: table,
			Item: this.jsonToItem(json,attributes)
		},function (err,data) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve(data);
			}
		});
		return deferred.promise;
	};
};