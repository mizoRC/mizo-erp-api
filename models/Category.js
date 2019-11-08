import { DataTypes } from "sequelize";
import sequelize from "../setup/sequelize";
import Product from './Product';
import { Company } from './CompanyEmployee';

const Category = sequelize.define("category",
	{
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        translationTag: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true,
        }
    },
	{
		modelName: "category",
		tableName: "categories"
	}
);

Category.hasMany(Product, { as: 'products', foreignKey: 'categoryId'});
Company.hasMany(Category, { as: 'categories', foreignKey: 'companyId'});

module.exports = Category;
