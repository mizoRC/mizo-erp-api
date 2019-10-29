import jwt from 'jsonwebtoken';
import { Employee } from '../models/CompanyEmployee';

class AuthError extends Error {
    constructor(code, message) {
        super(message);
        this.name = 'AuthError';
        this.code = code;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
};

const decodeAuthToken = async(req) => {
    try {
        let decodedToken = await jwt.verify(req.headers["x-mizo-erp-token"], process.env.JWT_SECRET);
        let employee = await Employee.findOne({id: decodedToken.id, email:decodedToken.email});
        if(employee){
            return employee;
        }
        else{
            throw new AuthError(401, 'Invalid token');
        }
    } catch (error) {
        throw new AuthError(401, 'Invalid token');
    }
}

export const checkIsAuthorized = async(req) => {
    if(!req.headers["x-mizo-erp-token"] || req.headers["x-mizo-erp-token"] == 'null'){
        throw new Error(`Token is required to throw this query(${req.body.operationName}). Login first against our api.`);
    }
    else{
        const employee = await decodeAuthToken(req);
        return employee;
    }
};

export const getEmployeeFromJWT = async (req) => {
    const employee = await decodeAuthToken(req);
    return employee;
};