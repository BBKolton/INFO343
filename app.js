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
var fs = require('fs');
var session = require('express-session'); //for user sessions

var app = express();


//authentication for UWNetID
var loginURL = '/shib';
var loginCallbackURL = '/login/callback';
var httpPort = process.env.HTTPPORT || 80;
var httpsPort = process.env.HTTPSPORT || 443;
//load certificate files
var pubCert = fs.readFileSync(config.root + 'security/info343.xyz.cert', 'utf-8');
var privKey = fs.readFileSync(config.root + 'security/info343.xyz.key', 'utf-8');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(cookieParser(config.cookieSecret));
app.use(session({
	secret: config.sessionSecret,
}));
app.use(passport.initialize());
app.use(passport.session());

//create the strategy for passport and have it use it
var strat = new shib.Strategy({
	entityId : "https://info343.xyz",
	privateKey : privKey,
	callbackUrl : loginCallbackURL,
	domain : "info343.xyz"
});
passport.use(strat);

//serialize and deserialize the user's session
passport.serializeUser(function(user, done) {
  done(null, user);
});
 
passport.deserializeUser(function(user, done) {
    done(null, user);
});

//user login, login callback, and metadata routes for netid
app.get(loginURL, passport.authenticate(strat.name), shib.backToUrl());
app.post(loginCallbackURL, passport.authenticate(strat.name), shib.backToUrl());
app.get(shib.urls.metadata, shib.metadataRoute(strat, pubCert));



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


//https server nbetid auth shib
//create https server and pass the express app
var httpsServer = https.createServer({
	key : privKey,
	cert : pubCert 
}, app);


var httpServer = http.createServer(function(req, res) {
	var redirURL = config.domain;
	redirURL += req.url;
	res.writeHead(301, {'Location' : redirURL});
	res.end();
	console.log("redirected to " + redirURL);
});

// //socket and persistant connection stuff
// require('./config/socket')(httpsServer, db);
// var sequelize = require('sequelize');

db.sequelize
	.sync()
	.then(function() {
		httpsServer.listen(443, function() {
			console.log('https listening on ' + httpsServer.address().port);
		});
		httpServer.listen(80, function() {
			console.log('http listening on ' + httpServer.address().port);
		});
	}).catch(function(e) {
		console.log(e)
		throw new Error(e);
	});