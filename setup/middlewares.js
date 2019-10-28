import { checkIsAuthorized } from '../utils/auth';
// Middleware de autentificación
export const authMiddleware = async (req, res, next) => {
    try {
        const publicEndpoints = ["IntrospectionQuery", "translations", "login", "register", "companies"];
        //TODO AUTH
        //next();
        //En caso de que la operación sea un endpoint público debemos dejar que siga
        if(publicEndpoints.includes(req.body.operationName)){
            next();
        }
        else {
            //En caso contrario comprobamos si está autentificado, es decir, si tiene token.
            const employee = await checkIsAuthorized(req); //Obtenemos el usuario correspondiente al token.
            res.locals.employee = employee; //Guardamos dicho employee en res.locals, que nos garantiza que se guarde dicho valor hasta el final de la petición.
            next();
        }
    } catch (error) {
        res.status(401);
        res.send({ errors: [{ message: error.message }] });
    }
};