module.exports = function(sequelize, DataTypes) {

	var checks = sequelize.define('checks', {
		id: {type: "INT", primaryKey: true},
		netId: "VARCHAR(45)",
		challenge: "TINYINT",
		listNumber: "TINYINT"
	}, {
		timestamps: false
	});

	return checks;
};