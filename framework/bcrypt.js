var bcrypt = require('bcrypt-nodejs');
var Promise = require('./index').Promise;

module.exports.compare = function compare(password,hash) {

	return new Promise(function (resolve,reject) {

		return bcrypt.compare(password,hash,function (err,result) {

			/* istanbul ignore if */
			if (err) {

				return reject(err);

			} else {

				if (result) {

					return resolve(true);

				} else {

					return reject(new Error('No Match'));

				}

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
