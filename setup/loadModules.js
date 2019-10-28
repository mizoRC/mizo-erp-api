import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';

export default (app) => {
    // CORS
    app.use(cors());
    app.options('*', cors());

    // BodyParser
    app.use(bodyParser.json({
        extended: false,
        parameterLimit: 500000,
        limit: '50mb'
    }));
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '50mb',
        parameterLimit: 500000
    }));

    // Helmet
    app.use(helmet());
}