const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

// env
const dotenv = require("dotenv");
dotenv.config();
console.log(process.env.DB_HOST);

//log
const morgan = require('morgan');
const {logger, stream} = require('./winton');
const combined = ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"' 
// 기존 combined 포멧에서 timestamp만 제거
const morganFormat = process.env.NODE_ENV !== "production" ? "dev" : combined; // NOTE: morgan 출력 형태 server.env에서 NODE_ENV 설정 production : 배포 dev : 개발

const indexRouter = require('./src/routes/index');
const usersRouter = require('./src/routes/user/users');

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'jade');

app.use(morgan('HTTP/:http-version :method :remote-addr :url :remote-user :status :res[content-length] :referrer :user-agent :response-time ms', { stream }));
//log
//app.use(morgan(morganFormat, {stream : logger.stream}));

//set
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.ISSUSER));
app.use(express.static(path.join(__dirname, 'public')));

//api web
app.use('/api-docs', express.static(__dirname + '/doc'));

app.use('/', indexRouter);
app.use('/user', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  logger.error('err ');
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
