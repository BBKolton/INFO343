var express = require('express');
var	router = express.Router();
var shib = require('passport-uwshib');

module.exports = function(app) {
	app.use('/', router);
};

//get all items for a specific challenge
router.get('/login', shib.ensureAuth('/shib'), function(req, res) {
	res.redirect('/');
});
