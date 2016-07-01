var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


const User = require('../models/User');

passport.serializeUser(function(user, done) {
  done(null, user.hash);
});

passport.deserializeUser(function(hash, done) {
  User.findOne({hash: hash}).then(user => {
    done(null, user.hash);
  }).catch(err => {
    done(err, null);
  });
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

router.post('/new', function(err, req, res, next) {
  User.findOne({hash: req.session.user}).then(user => {
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
  var user = req.session.passport.user;
  if (user) {
    res.json({loggedIn: true, email: req.session.passport.user.email});
  } else {
    res.json({loggedIn: false, email: ''});
  }
});

module.exports = router;
