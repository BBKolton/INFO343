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
	db.sequelize.query("SELECT p.id, p.netId, p.parent, p.challenge, p.title, p.text, count(v.post) as votes " +
	                "FROM posts p " +
	                "LEFT JOIN votes v ON p.id = v.post " +
	                "WHERE p.challenge = ?" + 
	                "GROUP BY p.id, v.post ", {replacements: [req.params.challenge]})
	.then(function(posts) {
		res.json(posts)
	})
});




//write a new post to an existing thread
router.post('/api/posts/challenge/:challenge', shib.ensureAuth('/shib'), function(req, res) {
	createPost(res, req.user.netId, req.body['title'], req.body['text'], req.body['parent'], req.params.challenge); 
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