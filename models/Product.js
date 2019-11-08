import { DataTypes } from "sequelize";
import sequelize from "../setup/sequelize";
import { Company } from './CompanyEmployee';

const Product = sequelize.define("product",
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
        barcode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        vat:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true,
        }
    },
	{
		modelName: "product",
		tableName: "products"
	}
);

Company.hasMany(Product, { as: 'products', foreignKey: 'companyId'});

module.exports = Product;
