import express from 'express';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger';
import { Employee } from '../models/CompanyEmployee';
const router = express.Router();

router.get('/get/:employeeID', async (req, res) => {
    try {
        const employeeID = req.params.employeeID;
        let employee = await Employee.findOne({where:{id: employeeID}});
        if(employee){
            const company = await employee.getCompany();
            const logo = company.logo;
            const extension = logo.substring("data:".length, logo.indexOf(";base64"))
            const b64Logo = logo.split(',')[1];
            var img = new Buffer(b64Logo, 'base64');
            res.writeHead(200, {
                'Content-Type': extension,
                'Content-Length': img.length 
            });
            res.end(img);
        }
        else{
            const img = fs.readFileSync(path.resolve(__dirname, `../resources/logo_complete.png`));
            res.writeHead(200, {'Content-Type': 'image/png' });
            res.end(img, 'binary');
        }
    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
});

module.exports = router;