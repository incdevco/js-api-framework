var base = process.env.PWD;

var expect = require('expect.js');
var mysql = require('mysql');

var sql = require(base+'/framework/sql');

describe('Framework.Sql',function () {
	it('delete',function () {
		var values = {
				field1: 'field1',
				field2: 'field2',
				field3: 'field3',
				field4: 'field4',
				field5: 'field5'
			},
			query = sql.delete().from('table').where(values);
		query = query.build();
		expect(query.sql).to.be.equal('DELETE FROM ?? WHERE ?? = ? AND ?? = ? AND ?? = ? AND ?? = ? AND ?? = ?');
		expect(query.inserts).to.be.eql([
			'table',
			'field1',
			'field1',
			'field2',
			'field2',
			'field3',
			'field3',
			'field4',
			'field4',
			'field5',
			'field5'
		]);
	});
	it('insert',function () {
		var values = {
				field1: 'field1',
				field2: 'field2',
				field3: 'field3',
				field4: 'field4',
				field5: 'field5'
			},
			query = sql.insert().into('table').set(values);
		query = query.build();
		expect(query.sql).to.be.equal('INSERT INTO ?? SET ?');
		expect(query.inserts).to.be.eql([
			'table',
			values
		]);
	});
	it('select',function () {
		var query = sql.select().from('table');
		query = query.build();
		expect(query.sql).to.be.equal('SELECT * FROM ??');
		expect(query.inserts).to.be.eql(['table']);
	});
	it('select with fields,where,limit and offset',function () {
		var fields = ['field1','field2'],
			where = {
				'field1':'field1',
				'field2':'field2'
			},
			limit = 1,
			offset = 5,
			query = sql.select().fields(fields).from('table').where(where).limit(limit).offset(offset);
		query = query.build();
		expect(query.sql).to.be.equal('SELECT ?? FROM ?? WHERE ?? = ? AND ?? = ? LIMIT ? OFFSET ?');
		expect(query.inserts).to.be.eql([
			fields,
			'table',
			'field1',
			'field1',
			'field2',
			'field2',
			limit,
			offset
		]);
		expect(mysql.format(query.sql,query.inserts)).to.be.equal("SELECT `field1`, `field2` FROM `table` WHERE `field1` = 'field1' AND `field2` = 'field2' LIMIT 1 OFFSET 5");
	});
	it('update',function () {
		var table = 'table',
			set = {
				'field1':'field1',
				'field2':2
			},
			where = {
				'field1':'field1',
				'field2':2
			},
			limit = 1,
			offset = 5,
			query = sql.update().table(table).set(set).where(where).limit(limit).offset(offset);
		query = query.build();
		expect(query.sql).to.be.equal('UPDATE ?? SET ? WHERE ?? = ? AND ?? = ? LIMIT ? OFFSET ?');
		expect(query.inserts).to.be.eql([
			table,
			set,
			'field1',
			'field1',
			'field2',
			2,
			limit,
			offset
		]);
		expect(mysql.format(query.sql,query.inserts)).to.be.equal("UPDATE `table` SET `field1` = 'field1', `field2` = 2 WHERE `field1` = 'field1' AND `field2` = 2 LIMIT 1 OFFSET 5");
	});
});