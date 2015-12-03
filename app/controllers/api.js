var express = require('express');
var	router = express.Router();
var db = require('../models');
var shib = require('passport-uwshib');

module.exports = function(app) {
	app.use('/', router);
};

 /*shib.ensureAuth('/login'),*/

//API's for the site. 
//call them with a URL like
//https://info343.xyz/api/SOMETHING/PARAMETERS
//these return json objects to be used in page creation


//get all items for a specific challenge
router.get('/api/items/:id', function(req, res) {
	db.items.findAll({
		where: {
			challenge: req.params.id
		}
	}).then(function(items) {
		console.log(items);
		res.json(items);
	});
});

//get all challenges
router.get('/api/challenges/all', function(req, res) {
	db.challenges.findAll().then(function(challenges) {
		console.log(challenges);
		res.json(challenges);
	})
})

//get just the challenge with the ID requested
router.get('/api/challenges/:id', function(req, res) {
	db.challenges.findById(req.params.id).then(function(challenges) {
		console.log(challenges);
		res.json(challenges);
	})
})