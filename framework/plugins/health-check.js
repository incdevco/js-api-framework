module.exports.bootstrap = function (application) {
	
	application.when('GET','/health-check',require('../controllers/health-check'));
	
};