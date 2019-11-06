import express from 'express';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger';
const router = express.Router();

router.get('/get', async (req, res) => {
    try {
        const img = fs.readFileSync(path.resolve(__dirname, `../resources/logo.png`));
        res.writeHead(200, {'Content-Type': 'image/png' });
        res.end(img, 'binary');
    } catch (error) {
        logger.error(error);
        res.status(500);
        res.send();
    }
});

module.exports = router;