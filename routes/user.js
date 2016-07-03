var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


const User = require('../models/User');

passport.serializeUser(function(user, done) {
  done(null, user.hash);
});

passport.deserializeUser(function(hash, done) {
  User.findOne({hash: hash}).then((err, user) => done(err, user));
});

// passport/login.js
passport.use(new LocalStrategy({
    passReqToCallback : true,
		usernameField : 'signin-username',
		passwordField : 'signin-password'
  },
  function(req, username, password, done) {
    User.findOne({
      name: username
    }).then(user => {
      if (user.checkPassword(password)) {
        done(null, user);
      } else {
        done(null, false);
      }
    }).catch(err => {
      done(err, false);
    });
	}
));

router.post('/new/', function(err, req, res, next) {
  User.findOne({hash: req.params.hash}).then(user => {
    // check submitted information
    req.login(user);
    next();
  });
});

router.post('/login', function(err, req, res, next) {
  passport.authenticate('local', next);
});

router.get('/logout', function(req, res, next) {
  req.logout();
  next();
});


router.get('/exists/:name', function(req, res, next) {
  User.findOne({name : req.params.name}).then((user) => {
    if (user) {
      return res.json({userExists: true});
    } else {
      return res.json({userExists: false});
    }
  }).catch(err => {
    next(err);
  });
});

router.all('/*', function(req, res) {
  var user = req.session.passport ? req.session.passport.user : null;
  if (user) {
    res.json({loggedIn: true, userHash: req.session.passport.user.hash});
  } else {
    res.json({loggedIn: false, userHash: null});
  }
});

module.exports = router;
