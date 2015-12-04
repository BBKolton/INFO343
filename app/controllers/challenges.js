var express = require('express');
var	router = express.Router();
var db = require('../models');
var shib = require('passport-uwshib');
var _ = require('lodash');

module.exports = function(app) {
	app.use('/', router);
};

//get all challenges
router.get('/api/challenges/all', function(req, res) {
	db.challenges.findAll().then(function(challenges) {
		console.log(challenges);
		res.json(challenges);
	})
});

//get just the challenge with the ID requested
router.get('/api/challenges/:id', function(req, res) {
	db.challenges.findById(req.params.id).then(function(challenges) {
		console.log(challenges);
		res.json(challenges);
	})
});
