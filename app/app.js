const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

// env
const dotenv = require("dotenv");
dotenv.config();

//log
const morgan = require('morgan');
const logger = require('./winton');

const indexRouter = require('./src/routes/index');
const usersRouter = require('./src/routes/user/users');
const aptRouter = require('./src/routes/apt/apts');

const app = express();
// view engine setup
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'jade');

//log
app.use(morgan('tiny', {stream : logger.stream}));

//set
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.ISSUSER));
app.use(express.static(path.join(__dirname, '/src/public')));

//api web
app.use('/api-docs', express.static(__dirname + '/doc'));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/apt', aptRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  logger.error(JSON.stringify(err));
  res.locals.message = err.err;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500)
  .json(err.status? {success:false, err:{name:err.name, message:err.message}}:{success:false, err:'Server Error'});
});

module.exports = app;
