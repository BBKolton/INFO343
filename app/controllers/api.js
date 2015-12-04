var express = require('express');
var	router = express.Router();
var db = require('../models');
var shib = require('passport-uwshib');
var _ = require('lodash');

module.exports = function(app) {
	app.use('/', router);
};

 /*shib.ensureAuth('/login'),*/

//API's for the site. 
//call them with a URL like
//https://info343.xyz/api/SOMETHING/PARAMETERS
//these return json objects to be used in page creation


//get all items for a specific challenge
router.get('/api/items/:challenge', function(req, res) {
	db.items.findAll({
		where: {
			challenge: req.params.challenge
		}
	}).then(function(items) {
		console.log(items);
		res.json(items);
	});
});

//post a completed checkmark
router.post('/api/checks/:challenge/:number', shib.ensureAuth('/shib'), function(req, res) {
	db.checks.find({
		where: {
			netId: req.user.netId,
			challenge: req.params.challenge
		}
	}).then(function(check) {
		if (!check) {
			db.create({
				netId: req.user.netId,
				challenge: req.params.challenge,
				listNumber: req.params.number
			});
		}
		res.json({status: "Successful"});
	});
});

router.get('/api/posts/:challenge', function(req, res) {
	db.posts.findAll({
		where: {
			challenge: req.params.challenge
		}
	}).then(function(posts) {
		res.json(posts);
	})
});

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