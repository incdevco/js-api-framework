var base = process.env.PWD;

var Framework = require(+'/framework');

module.exports.config = {
	connectionLimit: 10,
	host: 'localhost',
	port: 3306,
	user: 'incdevco_fw',
	password: 'incdevco_fw',
	data: 'incdevco_fw'
};

module.exports.pool = Framework.Mysql.createPool(module.exports.config);
