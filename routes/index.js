const homeRouter = require('./home');
const usersRouter = require('./users');
const dbVersionRouter = require('./db-version');
const loginRouter = require('./login');
const registerRouter = require('./register');
const userInfoRouter = require('./userInfo');

module.exports = (app) => {
    app.use('/', homeRouter);
    app.use('/api/users', usersRouter);
    app.use('/users/db-version', dbVersionRouter);
    app.use('/api/users/login', loginRouter);
    app.use('/api/users/register', registerRouter);
    app.use('/api/users/userInfo', userInfoRouter);
};
