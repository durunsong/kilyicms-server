const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cors = require('cors')
const app = express()
const PORT = 4000
app.use(
    cors({
        origin: ["https://kilyicms-server.vercel.app", "https://vercel.app", "https://vercel.com", "http://localhost:7000", "http://localhost:4000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

const homeRouter = require('./routes/home')
const loginRouter = require('./routes/login')
const echoRouter = require('./routes/echo')

app.use('/', homeRouter)
app.use('/api/users/login', loginRouter)
app.use('/echo', echoRouter)

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