/* eslint-disable no-console */

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
require('dotenv').config();

/**
* Allow JSX is Node
*/
require('node-jsx').install();

/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const lusca = require('lusca');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const ReactRender = require('react-dom/server').renderToString;

const getStore = require('./store');
const components = require('./components');

/**
 * API keys and Passport configuration.
 */
require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

const WikodeModel = require('./models/Wikode');

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const wikodeController = require('./controllers/wikode')(WikodeModel);

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(compression());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.state = {
    user: (req.user ? req.user.profile.name : null)
  };
  res.locals.view = null;
  next();
});

app.use(express.static(path.join(__dirname, 'dist'), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);

// app.get('/contact', contactController.getContact);
// app.post('/contact', contactController.postContact);
// app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
// app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
// app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
// app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
// app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

app.post('/wikode/', wikodeController.post); // create a brand new Wikode
app.post('/wikode/:user/:slug', wikodeController.fork); // fork a wikode belonging to :user to the current user
app.put('/wikode/:user/:slug', wikodeController.put); // update a Wikode
app.get('/wikode/:user/:slug', wikodeController.get);


// main rendering function
// serves HTML or JSON depending on req headers, and may also redirect
app.use(function(req, res, next) {
  const store = getStore(res.locals.state);

  if (req.accepts('text/html') && res.locals.redirect) {
    res.redirect(res.locals.redirect);

  } else if (req.accepts('text/html') && res.locals.view) {
    res.locals.reactHtml = ReactRender(components(res.locals.view, store));
    return res.render('index', res.locals);

  } else if (req.accepts('text/html')) {
    var err = new Error('Page not found');
    err.status = 404;
    return next(err);

  } else if (req.accepts('application/json')) {
    res.set('Content-Type', 'application/json');
    return res.json(res.locals.state);

  } else {
    res.status(400).send();

  }
});

// error handling render function
// renders the error page (HTML) or
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.locals.message = err.status ? err.message : 'Internal server error';

  if (req.accepts('text/html')) {
    res.render('error', res.locals);

  } else {
    res.set('Content-Type', 'application/json');
    return res.json(err.message);

  }

});


/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
