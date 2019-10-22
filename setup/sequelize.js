const Sequelize = require("sequelize");

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USERNAME,
	process.env.DB_PASSWD,
	{
		host: process.env.DB_HOST,
        port: process.env.DB_PORT,
		dialect: "postgres",
		pool: {
            max: 10,
            min: 1,
            idle: 10000,
            acquire: 10000,
            evict: 60000,
            handleDisconnects: true
        },
        //logging: false,
        retry: {
            max: 5
        },
        define: {
            timestamps: false
        }
	}
);

module.exports = sequelize;
