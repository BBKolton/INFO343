var express = require('express');
var	router = express.Router();
var db = require('../models');
var shib = require('passport-uwshib');
var _ = require('lodash');

module.exports = function(app) {
	app.use('/', router);
};

router.post('/api/vote/:postId', shib.ensureAuth('/shib'), function(req, res) {
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
				vote.upset({
					netId: req.user.netId,
					post: req.params.postId,
					val: req.body['val']
				}).then(function() {
					res.json({
						status: 1
					});
				});
			}
		});
	});
});
