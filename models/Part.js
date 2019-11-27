import { DataTypes } from "sequelize";
import sequelize from "../setup/sequelize";
import { Company, Employee } from './CompanyEmployee';
import Customer from './Customer';

const Part = sequelize.define("part",
	{
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        partId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        reason: {
            type: DataTypes.TEXT,
            defaultValue: ""
        },
        type: {
            type: DataTypes.JSON,
            allowNull: false
        },
        finished: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        notFinishedReason: {
            type: DataTypes.TEXT,
            defaultValue: ""
        },
        creationDate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.fn('now'),
            field: 'creation_date'
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        }
    },
	{
		modelName: "part",
		tableName: "parts"
	}
);

Company.hasMany(Part, { as: 'parts', foreignKey: 'companyId'});
Employee.hasMany(Part, { as: 'parts', foreignKey: 'employeeId'});
Customer.hasMany(Part, { as: 'parts', foreignKey: 'customerId'});
Part.belongsTo(Customer, { as: 'customer', foreignKey : 'customerId'});
Part.belongsTo(Employee, { as: 'employee', foreignKey : 'employeeId'});

module.exports = Part;