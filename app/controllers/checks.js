var express = require('express');
var	router = express.Router();
var db = require('../models');
var shib = require('passport-uwshib');
var _ = require('lodash');

module.exports = function(app) {
	app.use('/', router);
};

//post a completed checkmark
router.post('/api/checks/:challenge/:number', shib.ensureAuth('/shib'), function(req, res) {
	db.checks.find({
		where: {
			netId: req.user.netId,
			challenge: req.params.challenge,
			listNumber: req.params.number
		}
	}).then(function(check) {
		if (!check) {
			db.checks.create({
				netId: req.user.netId,
				challenge: req.params.challenge,
				listNumber: req.params.number
			});
		} else {
			check.destroy();
		}
		res.json({status: 1});
	});
});

router.get('/api/checks/:challenge', shib.ensureAuth('/shib'), function(req, res) {
	db.checks.findAll({
		where: {
			netId: req.user.netId,
			challenge: req.params.challenge
		}
	}).then(function(checks) {
		res.json(checks);
	})
})