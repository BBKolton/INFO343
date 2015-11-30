var express = require('express');
var	router = express.Router();
//var shib = require('passport-uwshib');

module.exports = function(app) {
	app.use('/', router);
};


router.get('/api/items/all', /*shib.ensureAuth('/login'),*/ function(req, res) {

});