require('dotenv').load()
const cors = require('cors')
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
var passport = require('passport')
const fileUpload = require('express-fileupload')
const csurf = require('csurf')
const cookieParser = require('cookie-parser')


require('./app_api/config/passport')
const routesWallet = require('./app_server/routes/index')
const routesApi = require('./app_api/routes/index')
const app = express()

app.use(cors({ origin: '*', credentials: true, origin: 'http://localhost:8080' }))
app.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 } }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(passport.initialize())
app.use('/api', routesApi)
// csrf and cookies
app.use(cookieParser())
// app.use(csurf({cookie: {httpOnly: true}}))
// global variable
global.APP_ROOT = path.resolve(__dirname)

// Cronjob to update deposits
const CronJob = require('cron').CronJob
const rp = require('request-promise')
const job = new CronJob('* * * * *', async function () {
    await rp(process.env.API_HOST + '/checkDeposits')
    console.log('Database updated...')
})

// error handlers
// catch unauthorized errors
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401)
        res.json({ message: 'Unauthorized user' })
    } else if (err.code === 'EBADCSRFTOKEN') {
        res.status(403)
        res.send('CSRF verification failed')
    } else if (err.message === 'missing_token_cookie') {
        res.status(401)
        res.json({ message: 'User not authenticated' })
        res.end()
    }
})

if (process.env.NODE_ENV === 'production') {
    app.set('port', process.env.PORT || 3000);
    app.listen(app.get('port'), function () {
        console.log('Listening on port ' + app.get('port'));
        job.start()
    });
} else if (process.env.NODE_ENV === 'dev') {
    app.set('port', process.env.PORT || 3000);
    app.listen(app.get('port'), function () {
        console.log('Listening on port ' + app.get('port'));
        job.start()
    });
}

module.exports = app

