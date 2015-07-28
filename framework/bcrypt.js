var bcrypt = require('bcrypt-nodejs');
var Promise = require('./promise');

module.exports.compare = function compare(password,hash) {

	return new Promise(function (resolve,reject) {

		return bcrypt.compare(password,hash,function (err,result) {

			/* istanbul ignore if */
			if (err) {

				return reject(err);

			} else {

				return resolve(result);

			}

		});

	});

};

module.exports.hash = function hash(password,length) {

	length = length || 10;

	return new Promise(function (resolve,reject) {

		return bcrypt.genSalt(length,function (err,salt) {

			/* istanbul ignore if */
			if (err) {

				return reject(err);

			} else {

				return bcrypt.hash(password,salt,null,function (err,hash) {

					/* istanbul ignore if */
					if (err) {

						return reject(err);

					} else {

						return resolve(hash);

					}

				});

			}

		});

	});

};
