import logo from '../routes/logo';

export default (app) => {
    app.use('/logo', logo);
}