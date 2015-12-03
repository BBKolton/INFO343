var path = require('path');
var rootPath = path.normalize(__dirname + '/..');

var config = {
	domain: "https://info343.xyz",
	root: rootPath + '/',
	app: {
		name: 'info343'
	},
	db: 'mysql://root:INFO343@localhost:3306/info343',
	port: 80,
	sessionSecret: '4QM9bUORPjg0IjqYSiUrpFcgepzF4WQKo0BthuLc',
	cookieSecret: 'Rax8W8EtmqgNUwtFfntN9BVJjcyWSvg829aLIlJq',
	sequelize: function() {
		var sequelize =  require('sequelize');
		return new sequelize('info343', 'root', 'INFO343', {
			host: "127.0.0.1",
			port: 3306
		});
	}
};

module.exports = config;
