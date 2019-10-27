import jwt from 'jsonwebtoken';
import Employee from '../models/Employee';

export const checkIsAuthorized = async(req) => {
    if(!req.headers["x-mizo-erp-token"] || req.headers["x-mizo-erp-token"] == 'null'){
        throw new Error(`Token is required to throw this query(${req.body.operationName}). Login first against our api.`);
    }
    else{
        let tokenPayload = await jwt.verify(req.headers["x-mizo-erp-token"], process.env.JWT_SECRET);
        let employee = await Employee.findOne({id: tokenPayload.id, email:tokenPayload.email});
        if(employee){
            return employee;
        }
        else{
            throw new Error('Token employee not found. Maybe your token is corrupted.');
        }
    }
};