import { DataTypes } from "sequelize";
import sequelize from "../setup/sequelize";
import { Company } from './CompanyEmployee';

const Customer = sequelize.define("customer",
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
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        creationDate:{
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.fn('now'),
            field: 'creation_date'
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true,
        }
    },
	{
		modelName: "customer",
		tableName: "customers"
	}
);

Company.hasMany(Customer, { as: 'customers', foreignKey: 'companyId'});

module.exports = Customer;
