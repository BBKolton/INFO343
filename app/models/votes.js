module.exports = function(sequelize, DataTypes) {

	var votes = sequelize.define('votes', {
		id: {type: "INT", primaryKey: true},
		netId: "VARCHAR(20)",
		post: "INT"
	}, {
		timestamps: false
	});

	return votes;
};