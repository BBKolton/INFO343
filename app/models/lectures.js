module.exports = function(sequelize, DataTypes) {

	var lectures = sequelize.define('lectures', {
		id: {type: "INT", primaryKey: true},
		name: "LONGTEXT",
		date: "DATE",
		slidesLink: "LONGTEXT"
	}, {
		timestamps: false
	});

	return lectures;
};