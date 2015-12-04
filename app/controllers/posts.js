var express = require('express');
var	router = express.Router();
var db = require('../models');
var shib = require('passport-uwshib');
var _ = require('lodash');

module.exports = function(app) {
	app.use('/', router);
};


router.get('/api/posts/:challenge', function(req, res) {
	db.posts.findAll({
		where: {
			challenge: req.params.challenge
		}
	}).then(function(posts) {
		res.json(posts);
	})
});
