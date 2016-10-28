require('dotenv').config();
require('node-jsx').install();

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-hbs');

const mongoose = require('mongoose');
const session = require('express-session');
const SessionStore = require('connect-mongo')(session);

const User = require('./models/User');

const React = require('react');
const {createStore} = require('redux');
const reducer = require('./store/reducer');
const routes = require('./routes/index');

const ReactRender = require('react-dom/server').renderToString;
const components = require('./components');

module.exports = function(config) {

  var app = express();

  // view engine setup
  app.engine('hbs', hbs.express3());
  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, 'views'));
  hbs.registerHelper('json', function(obj) {
    return JSON.stringify(obj);
  });

  // database setup
  mongoose.connect(config.test ? process.env.TEST_DB_CONNECT : process.env.DB_CONNECT);

  // basic middleware setup
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'dist')));

  /*
  ** SET UP SESSIONS
  */
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    // in test mode, use memory store so that sessions will be cleared once the tests
    // have run
    store: config.test ? null : new SessionStore({mongooseConnection: mongoose.connection})
  }));
  // app.use(passport.initialize());
  // app.use(passport.session());

  app.use(function(req, res, next) {

    // if the current user is anonymous, create an anonymous user with just a hash
    if (!req.session.user) {
      const user = {
        hash: 'abcd1234',
        name: 'User Name'
      };
      req.session.user = user;

    }

    next();

  });

  // set up the request context, used across the entire app
  app.use(function(req, res, next) {
    req.context = {
      stylesheets: [
        '//fonts.googleapis.com/css?family=Open+Sans:400,700,700italic,400italic',
        '/style.css'
      ],
      scripts: [
        '/main.js'
      ],
      state: {
        user: {
          hash: 'abcd1234',
          name: 'User Name'
        }
      }
    };

    next();
  });

  app.use('/', routes);

  app.all('*', function(req, res) {
    var store = createStore(reducer, req.context.state);

    if (req.accepts('text/html')) {
      req.context.reactHtml = ReactRender(components(req.context.view, store));
      return res.render('index', req.context);
    } else {
      return res.json(req.context.state);
    }

  });


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
