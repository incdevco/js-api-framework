var base = process.env.PWD;

var expect = require(base+'/framework/expect');
var mysql = require(base+'/framework/mysql');
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
			query = sql.delete().from('table').where(values).limit(1).offset(1);
		query.build();
		expect(query.sql).to.be.equal('DELETE FROM ?? WHERE ?? = ? AND ?? = ? AND ?? = ? AND ?? = ? AND ?? = ? LIMIT ? OFFSET ?');
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
			'field5',
			1,
			1
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
		query.build();
		expect(query.sql).to.be.equal('INSERT INTO ?? (??) VALUES (?)');
		expect(query.inserts).to.be.eql([
			'table',
			[
				'field1',
				'field2',
				'field3',
				'field4',
				'field5'
			],
			[
				'field1',
				'field2',
				'field3',
				'field4',
				'field5'
			]
		]);
	});
	
	it('select',function () {
		var query = sql.select().from('table');
		query.build();
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
		expect(query.sql).to.be.equal('SELECT field1,field2 FROM ?? WHERE ?? = ? AND ?? = ? LIMIT ? OFFSET ?');
		expect(query.inserts).to.be.eql([
			'table',
			'field1',
			'field1',
			'field2',
			'field2',
			limit,
			offset
		]);
		expect(mysql.format(query.sql,query.inserts)).to.be.equal("SELECT field1,field2 FROM `table` WHERE `field1` = 'field1' AND `field2` = 'field2' LIMIT 1 OFFSET 5");
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
	
	it('select with where object with value with space',function () {
		var query = sql.select().from('test_table').where({type: 'Domain Name'});
		query = query.build();
		expect(query.sql).to.be.equal('SELECT * FROM ?? WHERE ?? = ?');
		expect(query.inserts).to.be.eql(['test_table','type','Domain Name']);
	});
	
	it('select with where with > 0 value',function () {
		var query = sql.select().from('test_table').where({'available >': '0'});
		query = query.build();
		expect(query.sql).to.be.equal('SELECT * FROM ?? WHERE ?? > ?');
		expect(query.inserts).to.be.eql(['test_table','available','0']);
	});
	
	it('select with join',function () {
		var query = sql.select()
			.from('test')
			.joinLeft('join','test.id = join.id','*')
			.where('join.test','test');		
		query = query.build();
		expect(query.sql).to.be.equal('SELECT * FROM ?? LEFT JOIN ?? ON ?? = ?? WHERE ?? = ?');
		expect(query.inserts).to.be.eql([
			'test',
			'join',
			'test.id',
			'join.id',
			'join.test',
			'test'
		]);
	});
	
	it('select with order',function () {
		var query = sql.select().from('table').order('id');
		query.build();
		expect(query.sql).to.be.equal('SELECT * FROM ?? ORDER BY ??');
		expect(query.inserts).to.be.eql(['table','id']);
	});
	
	it('select with order with DESC',function () {
		var query = sql.select().from('table').order('id DESC');
		query.build();
		expect(query.sql).to.be.equal('SELECT * FROM ?? ORDER BY ?? DESC');
		expect(query.inserts).to.be.eql(['table','id']);
	});
	
	it('select with order array',function () {
		var query = sql.select().from('table').order(['id DESC','test']);
		query.build();
		expect(query.sql).to.be.equal('SELECT * FROM ?? ORDER BY ?? DESC, ??');
		expect(query.inserts).to.be.eql(['table','id','test']);
	});
	
	it('select with offset no limit',function () {
		var query = sql.select().from('table').offset(10);
		query.build();
		expect(query.sql).to.be.equal('SELECT * FROM ?? LIMIT 18446744073709551615 OFFSET ?');
		expect(query.inserts).to.be.eql(['table',10]);
	});
	
	it('select with negative offset',function () {
		var query = sql.select().from('table').offset(-10);
		query.build();
		expect(query.sql).to.be.equal('SELECT * FROM ?? LIMIT 18446744073709551615 OFFSET ?');
		expect(query.inserts).to.be.eql(['table',0]);
	});
	
});