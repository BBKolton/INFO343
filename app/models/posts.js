module.exports = function(sequelize, DataTypes) {

	var posts = sequelize.define('posts', {
		id: {type: "INT", primaryKey: true},
		netId: "VARCHAR(45)",
		parent: "INT(10)",
		challenge: "INT(11)",
		title: "LONGTEXT",
		text: "LONGTEXT"
	}, {
		timestamps: false
	});

	return posts;
};