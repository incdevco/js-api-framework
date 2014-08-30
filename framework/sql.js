
function Delete() {
	this._limit = null;
	this._offset = null;
	this._table = null;
	this._where = null;
}

Delete.prototype.build = function () {
	var str = 'DELETE FROM ??',
		inserts = [this._table];
	if (this._where) {
		//console.log(this._where);
		str += ' WHERE ';
		var count = 0;
		for (var i in this._where) {
			var where = this._where[i].build();
			//console.log(where);
			if (count > 0) {
				str += ' AND ';
			}
			str += where.sql;
			for (var a in where.inserts) {
				inserts.push(where.inserts[a]);
			}
			//console.log(inserts);
			count++;
		}
	}
	if (this._limit) {
		str += ' LIMIT ?';
		inserts.push(this._limit);
	}
	if (this._offset) {
		str += ' OFFSET ?';
		inserts.push(this._offset);
	}
	return {
		sql: str,
		inserts: inserts
	};
};
Delete.prototype.from = function (table) {
	this._table = table;
	return this;
};
Delete.prototype.limit = function (limit) {
	this._limit = parseInt(limit);
	return this;
};
Delete.prototype.offset = function (offset) {
	this._offset = parseInt(offset);
	return this;
};
Delete.prototype.where = function (key,value,comparator) {
	if (typeof key == 'object') {
		for (var i in key) {
			this.where(i,key[i]);
		}
	} else {
		if (null === this._where) {
			this._where = [];
		}
		this._where.push(new Where({
			key: key,
			comparator: comparator,
			value: value
		}));
	}
	return this;
};

function Insert() {
	this._table = null;
	this._values = null;
}

Insert.prototype.build = function () {
	return {
		sql: 'INSERT INTO ?? SET ?',
		inserts: [
			this._table,
			this._values
		]
	};
};
Insert.prototype.into = function (table) {
	this._table = table;
	return this;
};
Insert.prototype.set = function (object) {
	this._values = object;
	return this;
};

function Select() {
	this._fields = null;
	this._limit = null;
	this._offset = null;
	this._order = null;
	this._table = null;
	this._where = null;
}

Select.prototype.build = function () {
	var str = '',
		inserts = [];
	str += 'SELECT ';
	if (this._fields) {
		str += '??';
		inserts.push(this._fields);
	} else {
		str += '*';
	}
	str += ' FROM ??';
	inserts.push(this._table);
	if (this._where) {
		//console.log(this._where);
		str += ' WHERE ';
		var count = 0;
		for (var i in this._where) {
			var where = this._where[i].build();
			//console.log(where);
			if (count > 0) {
				str += ' AND ';
			}
			str += where.sql;
			for (var a in where.inserts) {
				inserts.push(where.inserts[a]);
			}
			//console.log(inserts);
			count++;
		}
	}
	if (this._limit) {
		str += ' LIMIT ?';
		inserts.push(this._limit);
	}
	if (this._offset) {
		str += ' OFFSET ?';
		inserts.push(this._offset);
	}
	if (this._order) {
		str += ' ORDER BY ?';
		inserts.push(this._order);
	}
	return {
		sql: str,
		inserts: inserts
	};
};
Select.prototype.fields = function (fields) {
	this._fields = fields;
	return this;
};
Select.prototype.from = function (table) {
	this._table = table;
	return this;
};
Select.prototype.limit = function (limit) {
	this._limit = parseInt(limit);
	return this;
};
Select.prototype.offset = function (offset) {
	this._offset = parseInt(offset);
	return this;
};
Select.prototype.order = function (order) {
	this._order = order;
	return this;
};
Select.prototype.where = function (key,value,comparator) {
	if (typeof key == 'object') {
		for (var i in key) {
			this.where(i,key[i]);
		}
	} else {
		if (null === this._where) {
			this._where = [];
		}
		if (/(><=)?\s/.test(value)) {
			var parts = value.split(' ',2);
			comparator = parts[0];
			value = parts[1];
			console.log('select.where',parts,comparator,value);
		}
		this._where.push(new Where({
			key: key,
			comparator: comparator,
			value: value
		}));
	}
	return this;
};

function Update() {
	this._limit = null;
	this._offset = null;
	this._set = null;
	this._table = null;
	this._where = null;
}

Update.prototype.build = function () {
	var str = 'UPDATE ?? SET ?',
		inserts = [this._table,this._set];
	if (this._where) {
		//console.log(this._where);
		str += ' WHERE ';
		var count = 0;
		for (var i in this._where) {
			var where = this._where[i].build();
			//console.log(where);
			if (count > 0) {
				str += ' AND ';
			}
			str += where.sql;
			for (var a in where.inserts) {
				inserts.push(where.inserts[a]);
			}
			//console.log(inserts);
			count++;
		}
	}
	if (this._limit) {
		str += ' LIMIT ?';
		inserts.push(this._limit);
	}
	if (this._offset) {
		str += ' OFFSET ?';
		inserts.push(this._offset);
	}
	return {
		sql: str,
		inserts: inserts
	};
};
Update.prototype.limit = function (limit) {
	this._limit = parseInt(limit);
	return this;
};
Update.prototype.offset = function (offset) {
	this._offset = parseInt(offset);
	return this;
};
Update.prototype.set = function (set) {
	this._set = set;
	return this;
};
Update.prototype.table = function (table) {
	this._table = table;
	return this;
};
Update.prototype.where = function (key,value,comparator) {
	if (typeof key == 'object') {
		for (var i in key) {
			this.where(i,key[i]);
		}
	} else {
		if (null === this._where) {
			this._where = [];
		}
		this._where.push(new Where({
			key: key,
			comparator: comparator,
			value: value
		}));
	}
	return this;
};

function Where(config) {
	this._comparator = config.comparator || '=';
	this._key = config.key;
	this._value = config.value;
	if (null === this._value) {
		this._comparator = 'IS';
	}
}

Where.prototype.build = function () {
	var str = '?? '+this._comparator,
		inserts = [this._key];
		if (this._value instanceof Select) {
			var select = this._value.build();
			str += ' ('+select.sql+')';
			for (var i in select.inserts) {
				inserts.push(select.inserts[i]);
			}
		} else {
			str += ' ?';
			inserts.push(this._value);
		}
	return {
		sql: str,
		inserts: inserts
	};
};

module.exports.delete = function () {
	return new Delete();
};
module.exports.insert = function () {
	return new Insert();
};
module.exports.select = function () {
	return new Select();
};
module.exports.update = function () {
	return new Update();
};