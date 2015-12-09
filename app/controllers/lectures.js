var express = require('express');
var	router = express.Router();
var db = require('../models');
var shib = require('passport-uwshib');
var _ = require('lodash');

module.exports = function(app) {
	app.use('/', router);
};

//get all lectures
router.get('/api/lectures/all', function(req, res) {
	db.lectures.findAll().then(function(lectures) {
		res.json(lectures);
	})
});

//get just the challenge with the ID requested
router.get('/api/lectures/:id', function(req, res) {
	db.lectures.findById(req.params.id).then(function(lectures) {
		console.log(lectures);
		res.json(lectures);
	})
});
