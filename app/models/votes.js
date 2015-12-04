module.exports = function(sequelize, DataTypes) {

	var votes = sequelize.define('votes', {
		id: {type: "INT", primaryKey: true},
		netId: "VARCHAR(20)",
		post: "INT",
		val: "TINYINT"
	}, {
		timestamps: false
	});

	return votes;
};