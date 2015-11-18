var express = require('express');
var glob = require('glob');
// var config = require('./config/config');
var path = require('path');
// var views = path.join(config.root, 'app', 'views');

var app = express();

// app.set('view engine', 'jade');
// app.set('views', views);

// //static page index for the thing
// app.get('/public/info343', function(req, res) {
// 	res.redirect('/public/info343/index.html')
// });
// app.use(express.static('public'));

// var controllers = glob.sync(path.join(config.root, 'app', 'controllers', '*.js'));
// controllers.forEach(function assignController(controller) {
// 	require(controller)(app);
// });


app.get('*', function(req, res) {
	res.send('HERP DE DERP');
	console.log('request sent');
})

var server = app.listen(80, function() {
	console.log('App running on port ' + server.address().port);
});