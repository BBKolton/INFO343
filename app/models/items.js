module.exports = function(sequelize, DataTypes) {

	var items = sequelize.define('items', {
		id: {type: "INT", primaryKey: true},
		netId: "VARCHAR(45)",
		completed: "TINYINT"
	});

	return items;
};