var http = require('http'); //for rerouting during netid logins
var https = require('https'); //for rerouting during netid logins
var express = require('express'); //the xpress app framework
var glob = require('glob'); //allows for globbing files by names
var cookieParser = require('cookie-parser'); //no explanation needed
var bodyParser = require('body-parser'); //parses json, html, etc to html
var passport = require('passport'); //user authentication
var shib = require('passport-uwshib'); //for shiubboleth authentication
var db = require('./app/models'); //database connections
var path = require('path');
var config = require('./config/config');

var app = express();

//static page index for the thing
app.get('/', function(req, res) {
	res.redirect('/index.html')
});
app.use(express.static('public'));
app.use(express.static('public/pages'));

var controllers = glob.sync(path.join(config.root, 'app', 'controllers', '*.js'));
controllers.forEach(function assignController(controller) {
	require(controller)(app);
}); 

var server = app.listen(80, function() {
	console.log('App running on port ' + server.address().port);
});