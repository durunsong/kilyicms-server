const homeRouter = require('./home');
const usersRouter = require('./users');
const dbVersionRouter = require('./db-version');
const loginRouter = require('./login');
const registerRouter = require('./register');
const userInfoRouter = require('./userInfo');
const deleteListUserRouter = require('./deleted-users');
const restoreUserRouter = require('./restore-users');
const logoutRouter = require('./logout');

module.exports = (app) => {
    app.use('/', homeRouter);
    app.use('/db-version', dbVersionRouter);
    app.use('/api/users', usersRouter);
    app.use('/api/users/login', loginRouter);
    app.use('/api/users/register', registerRouter);
    app.use('/api/users/userInfo', userInfoRouter);
    app.use('/api/users/deleteList', deleteListUserRouter);
    app.use('/api/users/restore', restoreUserRouter);
    app.use('/api/users/logout', logoutRouter);
};
