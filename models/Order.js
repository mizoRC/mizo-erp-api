import { DataTypes } from "sequelize";
import sequelize from "../setup/sequelize";
import { Company, Employee } from './CompanyEmployee';
import Customer from './Customer';

const Order = sequelize.define("order",
	{
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        ticketId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        total: {
            type: DataTypes.DECIMAL,
            defaultValue: 0
        },
        paymentMethod: {
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
            defaultValue: true
        }
    },
	{
		modelName: "order",
		tableName: "orders"
	}
);

const Line = sequelize.define("line",
	{
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        vat:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        units:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false,
        }
    },
	{
		modelName: "line",
		tableName: "lines"
	}
);

Company.hasMany(Order, { as: 'orders', foreignKey: 'companyId'});
Employee.hasMany(Order, { as: 'orders', foreignKey: 'employeeId'});
Customer.hasMany(Order, { as: 'orders', foreignKey: {
    name: 'customerId',
    allowNull: true
}});
Order.hasMany(Line, {as: 'lines', foreignKey: 'orderId'});
Order.belongsTo(Customer, { as: 'customer', foreignKey : 'customerId'});

module.exports = {
    Line: Line,
    Order: Order
}
