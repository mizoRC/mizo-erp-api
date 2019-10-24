import { DataTypes } from 'sequelize';
import sequelize from '../setup/sequelize';
import Company from './Company';

const User = sequelize.define('user', 
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
        surname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        language: {
            type: DataTypes.STRING,
            allowNull: false
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
        },
        // foreign keys:
        companyId: {
            type: DataTypes.INTEGER,
            references: {
                // This is a reference to another model
                model: Company,
                // This is the column name of the referenced model
                key: 'id'
            }
        }
    },
	{
		modelName: "user",
		tableName: "users"
	}
);

module.exports = User;