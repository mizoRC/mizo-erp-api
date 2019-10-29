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
        country: {
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
		modelName: "company",
		tableName: "companies"
	}
);

const Employee = sequelize.define('employee', 
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
        role: {
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
        }
    },
	{
		modelName: "employee",
		tableName: "employees"
	}
);

Employee.belongsToMany(Company, { as: 'companies', through: 'companies_employees', foreignKey: 'employeeId', otherKey: 'companyId'});
Company.belongsToMany(Employee, { as: 'employees', through: 'companies_employees', foreignKey: 'companyId', otherKey: 'employeeId'});

module.exports = {
    Company: Company,
    Employee: Employee
}