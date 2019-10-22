import { DataTypes } from "sequelize";
import sequelize from "../setup/sequelize";

const Translation = sequelize.define("translation",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		label: {
			type: DataTypes.STRING,
			unique: true
		},
		es: {
			type: DataTypes.STRING
		},
		en: {
			type: DataTypes.STRING
		}
	},
	{
		modelName: "translation",
		tableName: "translations"
	}
);

module.exports = Translation;
