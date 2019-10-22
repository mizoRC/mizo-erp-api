require('dotenv').config();
import express from 'express';

import setupStartServer from './setup/startServer';
import logger from './utils/logger';

//process.setMaxListeners(0);

const app = express();

setupStartServer(app);

export default app;