var path = require('path');
var rootPath = path.normalize(__dirname + '/..');

var config = {
	domain: "https://info343.xyz",
	root: rootPath + '/',
	app: {
		name: 'info343'
	},
	port: 80,
	sessionSecret: '4QM9bUORPjg0IjqYdFCrpFcgepzF4WQKo0BthuLc',
	cookieSecret: 'Rax8W8EtmqgNUwtFfntN9BVJjcyWSvg8YtOLIlJq',
	sequelize: function() {
		var sequelize =  require('sequelize');
		return new sequelize('INFO343', 'root', 'INFO343', {
			host: "127.0.0.1",
			port: 3306
		});
	}
};

module.exports = config;
