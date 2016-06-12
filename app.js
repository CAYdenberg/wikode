var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-hbs');

const mongoose = require('mongoose');
const session = require('express-session');
const SessionStore = require('connect-mongo')(session);

const randomstring = require('randomstring').generate;

const User = require('./models/User');

var routes = require('./routes/index');

module.exports = function() {

  var app = express();

  // view engine setup
  app.engine('hbs', hbs.express3());
  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, 'views'));
  hbs.registerHelper('json', function(obj) {
    return JSON.stringify(obj);
  });

  // database setup
  mongoose.connect(process.env.DB_CONNECT);

  // basic middleware setup
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'dist')));

  // set up sessions
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new SessionStore({mongooseConnection: mongoose.connection})
  }));

  // basic setup - used across the entire app
  app.use(function(req, res, next) {

    // set up sessions
    if (!req.session.user) {
      new User({
        hash: randomstring(8)
      }).save().then(user => {
        req.session.user = user;
        next();
      }).catch((err) => {
        next(err);
      });
    } else {
      next();
    }

  });

  app.use(function(req, res, next) {

    req.context = {
      stylesheets: [
        '//fonts.googleapis.com/css?family=Open+Sans:400,700,700italic,400italic',
        'style.css'
      ],
      scripts: [
        'main.js'
      ]
    };

    // set up data
    req.context.data = {
      userHash: req.session.user.hash
    };
    next();

  });

  //specify routes
  app.use('/', routes);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (process.env.ENV === 'development') {
    app.use(function(err, req, res) {
      res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

  app.set('port', process.env.PORT || 3000);

  return app;
}
