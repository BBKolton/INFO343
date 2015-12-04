var express = require('express');
var	router = express.Router();
var db = require('../models');
var shib = require('passport-uwshib');
var _ = require('lodash');

module.exports = function(app) {
	app.use('/', router);
};

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