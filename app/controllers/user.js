var express = require('express');
var	router = express.Router();
var db = require('../models');
var shib = require('passport-uwshib');
var _ = require('lodash');

module.exports = function(app) {
	app.use('/', router);
};

//get user data. Returns a basic status thing if user isnt logged in
router.get('/api/user', function(req, res) {
	if (_.isEmpty(req.user)) {
		res.json({
			status: 2,
			messsage: "Not logged in"
		});
	} else {
		res.json({
			firstName: _.startCase(req.user.givenName.toLowerCase()),
			lastName: _.startCase(req.user.surname.toLowerCase()),
			netId: req.user.netId
		});
	}
});

//get all items for a specific challenge
router.get('/login', shib.ensureAuth('/shib'), function(req, res) {
	console.log(req.user);
	res.redirect('/');
});
