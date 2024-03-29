var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors = require("cors");
var app = express();


//env setup
const dotenv = require('dotenv');
dotenv.config();
console.log(process.env.mongodbUri)
    // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var originsWhitelist = [
    'http://localhost:4200',
    'http://192.168.0.106/cdns/test.html',
    'file:///E:/gestureDetection/gestureDetectionApp/views/index.html'
];
var corsOptions = {
    origin: function(origin, callback) {
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    },
    credentials: true
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
const mongoose = require('mongoose');
var uri = process.env.mongodbUri;
mongoose.Promise = global.Promise;
mongoose.connect(uri, { useNewUrlParser: true });
mongoose.connection.on('error', () => {
    console.log('Connection Error')
});
mongoose.connection.on('open', () => {
    console.log('Connection established ');
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