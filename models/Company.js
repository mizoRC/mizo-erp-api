import { DataTypes } from 'sequelize';
import sequelize from '../setup/sequelize';

const Company = sequelize.define('company', 
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
        tin: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: ''
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: ''
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: ''
        },
        logo: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: ''
        },
        domain: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '',
            field: 'domain'
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
        timestamps: false
    }
);

module.exports = Company;