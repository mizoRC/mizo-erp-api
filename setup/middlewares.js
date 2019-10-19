import { checkIsAuthorized } from '../utils/auth';
// Middleware de autentificación
export const authMiddleware = async (req, res, next) => {
    try {
        const publicEndpoints = ["login", "translations", "companies"];
        //TODO AUTH
        next();
        //En caso de que la operación sea login debemos dejar que siga ya que es un endpoint público
        /* if(publicEndpoints.includes(req.body.operationName)){
            next();
        }
        else {
            //En caso contrario comprobamos si está autentificado, es decir, si tiene token.
            const user = await checkIsAuthorized(req); //Obtenemos el usuario correspondiente al token.
            res.locals.user = user; //Guardamos dicho user en res.locals, que nos garantiza que se guarde dicho valor hasta el final de la petición.
            next();
        } */
    } catch (error) {
        res.status(401);
        res.send({ errors: [{ message: error.message }] });
    }
};