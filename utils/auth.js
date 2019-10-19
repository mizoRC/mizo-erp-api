import jwt from 'jsonwebtoken';
export const checkIsAuthorized = async(req) => {
    if(!req.headers["x-mizo-erp-token"] || req.headers["x-mizo-erp-token"] == 'null'){
        throw new Error('Token is required to throw this query. Login first against our api.');
    }
    else{
        let tokenPayload = await jwt.verify(req.headers["x-mizo-erp-token"], process.env.JWT_SECRET);
        let user = await User.findOne({id: tokenPayload.id, user:tokenPayload.user});
        if(user){
            return user;
        }
        else{
            throw new Error('Token user not found. Maybe your token is corrupted.');
        }
    }
};