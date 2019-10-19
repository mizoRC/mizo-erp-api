require('dotenv').config();
import express from 'express';
import sequelize from './setup/sequelize';
import setupStartServer from './setup/startServer';
import logger from './utils/logger';

//process.setMaxListeners(0);

const app = express();

sequelize.sync().then(() => {
    logger.info('[INFO] - Database connected.')
    setupStartServer(app);
})
.catch(error => {
    logger.error(`[ERROR] - Unable to connect to the database: ${error}`);
    logger.error('[ERROR] - SERVER NOT STARTED');
    throw new Error(error);
});

export default app;