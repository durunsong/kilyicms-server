const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 4000
app.use(express.json());
app.use(
    cors({
        origin: '*', // 或者指定允许的源
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
);
app.options('*', (req, res) => {
    res.sendStatus(200); // 处理预检请求
});
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

const homeRouter = require('./routes/home')
const loginRouter = require('./routes/login')
const echoRouter = require('./routes/echo')
const datasRouter = require('./routes/datas')
const userRouter = require('./routes/user')
const userInfoRouter = require('./routes/userInfo')

app.use('/api/users', homeRouter)
app.use('/api/users/login', loginRouter)
app.use('/echo', echoRouter)
app.use('/datas', datasRouter)
app.use('/userData', userRouter)
app.use('/api/users/userInfo', userInfoRouter)

app.use(function (req, res, next) {
    next(createError(404))
})

app.use(function (err, req, res, next) {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    res.status(err.status || 500)
    res.render('error')
})

app.listen(PORT, () => console.log("Listening at ", PORT))

module.exports = app 