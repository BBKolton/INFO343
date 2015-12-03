module.exports = function(sequelize, DataTypes) {

	var challenges = sequelize.define('challenges', {
		id: {type: "INT", primaryKey: true},
		name: "VARCHAR(45)",
		description: "LONGTEXT",
		dueDate: "DATETIME",
		points: "MEDIUMINT"
	}, {
		timestamps: false
	});

	return challenges;
};