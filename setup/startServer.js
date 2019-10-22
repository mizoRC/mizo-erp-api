import { createServer } from 'http';
import bodyParser from 'body-parser';
import { ApolloServer, PubSub } from 'apollo-server-express';
import typeDefs from '../graphql/types';
import resolvers from '../graphql/resolvers';
import models from '../models/index'; //NEEDED TO SYNC ALL MODELS
import sequelize from '../setup/sequelize';
import { authMiddleware } from './middlewares';
import logger from '../utils/logger';

export default (app) => {
    const pubsub = new PubSub();
    app.set('pubsub', pubsub);

    const playgroundActived = process.env.PLAYGROUND_STATUS === 'actived';
    const apollo = new ApolloServer({ 
        typeDefs,
        resolvers,
        introspection: playgroundActived,
        playground: playgroundActived,
        context:({ req, res }) => ({req: req, res: res}),
        subscriptions:{
            onConnect: async(connectionParams, webSocket) => {
                //TODO AUTH
                return true;
                /* if(connectionParams.token){
                    let tokenPayload = await jwt.verify(connectionParams.token, process.env.JWT_SECRET);
                    let user = await User.findOne({id: tokenPayload.id, user:tokenPayload.user});
                    if(user){
                        return {user: user};
                    }
                    else{
                        throw new Error('Missing auth token!');
                    }
                }
                else{
                    throw new Error('Missing auth token!');
                } */
            }
        },
        formatError: (err) => {
            console.error(err);
            return {
                message: err.message,
                code: err.originalError && err.originalError.code,   // <--
                locations: err.locations,
                path: err.path,
                stack: err.stack,
                originalError: err.originalError
            };
        }
    });

    const path = "/graphql";
    app.use(path, [bodyParser.json(), authMiddleware]);

    apollo.applyMiddleware({app, path});

    const server = createServer(app);
    apollo.installSubscriptionHandlers(server);

    sequelize.authenticate().then(() => {
        logger.info('[INFO] - Database connected.');
        sequelize.sync().then(() => {
            logger.info('[INFO] - Database sync.');
            server.listen((process.env.PORT), () => {
                logger.info('*******************************************************************');
                logger.info('*                                                                 *');
                logger.info('*  ███╗   ███╗██╗███████╗ ██████╗       ███████╗██████╗ ██████╗   *');
                logger.info('*  ████╗ ████║██║╚══███╔╝██╔═══██╗      ██╔════╝██╔══██╗██╔══██╗  *');
                logger.info('*  ██╔████╔██║██║  ███╔╝ ██║   ██║█████╗█████╗  ██████╔╝██████╔╝  *');
                logger.info('*  ██║╚██╔╝██║██║ ███╔╝  ██║   ██║╚════╝██╔══╝  ██╔══██╗██╔═══╝   *');
                logger.info('*  ██║ ╚═╝ ██║██║███████╗╚██████╔╝      ███████╗██║  ██║██║       *');
                logger.info('*  ╚═╝     ╚═╝╚═╝╚══════╝ ╚═════╝       ╚══════╝╚═╝  ╚═╝╚═╝       *');
                logger.info('*                                                                 *');
                logger.info('*******************************************************************');
                logger.info(`🚀  Server ready on PORT ${process.env.PORT}, GRAPHQL_PATH at ${apollo.graphqlPath} and SUBSCRIPTIONS ON ${apollo.subscriptionsPath}`);
            });
        })
        .catch(error => {
            throw new Error(error);
        });
    })
    .catch(error => {
        logger.error(`[ERROR] - Unable to connect to the database: ${error}`);
        logger.error('[ERROR] - SERVER NOT STARTED');
        throw new Error(error);
    });
};