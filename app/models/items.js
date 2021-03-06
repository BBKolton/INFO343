module.exports = function(sequelize, DataTypes) {

	var items = sequelize.define('items', {
		id: {type: "INT", primaryKey: true},
		challenge: "TINYINT",
		placement: "TINYINT",
		description: "LONGTEXT"
	}, {
		timestamps: false
	});

	return items;
};