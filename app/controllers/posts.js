var express = require('express');
var	router = express.Router();
var db = require('../models');
var shib = require('passport-uwshib');
var _ = require('lodash');

module.exports = function(app) {
	app.use('/', router);
};

//get all posts of a challenge
router.get('/api/posts/:challenge', function(req, res) {
	db.posts.findAll({
		where: {
			challenge: req.params.challenge
		}, order: [['parent', 'ASC']]
	}).then(function(posts) {
		res.json(posts);
	})
});

//write a new thread for a challenge
router.post('/api/posts/challenge/:challenge', shib.ensureAuth('/shib'), function(req, res) {
	createPost(res, req.user.netId, req.body['title'], req.body['text'], null, req.params.challenge)
})

//write a new post to an existing thread
router.post('/api/posts/post:post', shib.ensureAuth('/shib'), function(req, res) {
	createPost(res, req.user.netId, req.body['title'], req.body['text'], req.body['parent'], null); //fix this null later
})

function createPost(res, netId, title, text, parent, challenge) {
	db.posts.create({
		netId: netId,
		title: title,
		text: text,
		parent: parent,
		challenge: challenge
	}).then(function() {
		res.json({
			status: 1
		});
	})
}
//lolol