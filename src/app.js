const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
// const morgan = require('./config/morgan');

// const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const { jwtStrategy } = require('./config/passport');
const jobremainder=require("./routes/v1/job/job.service")

const app = express();

const cron = require("node-cron");

//*/10 * * * *

cron.schedule("*/10 * * * *", function () {
  jobremainder.jobRemainderNotification()
});








// set security HTTP headers //doubt
app.use(helmet());//doubt

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());
// passport jwt
app.use(passport.initialize());

app.get('/hi', (req, res) => {
    res.send('Hello World!')
  })
passport.use('jwt', jwtStrategy);

// v1 api routes
app.use(routes);


// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// // convert error to ApiError, if needed
 app.use(errorConverter);   //doubt

// // handle error
app.use(errorHandler);

module.exports = app;