var express = require('express');
var	router = express.Router();
var db = require('../models');
var shib = require('passport-uwshib');
var _ = require('lodash');

module.exports = function(app) {
	app.use('/', router);
};

router.post('/api/votes/:postId', shib.ensureAuth('/shib'), function(req, res) {
	db.votes.find({
		where: {
			netId: req.user.netId,
			post: req.params.postId
		}
	}).then(function(vote) {
		db.posts.findById(req.params.postId).then(function(post) {
			if (post.netId == req.user.netId) {
				res.json({
					status: 2,
					message: "This is your own post"
				});
			} else {
				if (!vote) {
					db.votes.upsert({
						netId: req.user.netId,
						post: req.params.postId
					}).then(function() {
						res.json({
							status: 1
						});
					});
				} else {
					vote.destroy();
					res.json({
						status: 1
					})
				}
			}
		});
	});
});

router.get('/api/votes/my', shib.ensureAuth('/shib'), function(req, res) {
	db.votes.findAll({
		where: {
			netId: req.user.netId
		}
	}).then(function(votes) {
		res.json(votes);
	})
})