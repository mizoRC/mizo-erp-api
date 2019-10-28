require('dotenv').config();
import express from 'express';

import loadModules from './setup/loadModules';
import setupStartServer from './setup/startServer';

//process.setMaxListeners(0);

const app = express();

loadModules(app);
setupStartServer(app);

export default app;