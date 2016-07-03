var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


const User = require('../models/User');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
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

router.post('/new', function(req, res, next) {
  User.findOne({hash: req.session.user.hash}).then(user => {
    Object.assign(user, {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    user.save().then(user => {
      req.login(user, next);
    }).catch(err => {
      res.status(401).json(err.message);
    });
  });
});

router.post('/login', passport.authenticate('local'), function(err, req, res, next) {
  if (err) {
    res.status(401).json({});
  }
  next();
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
  if (req.user) {
    res.json({loggedIn: true, userHash: req.user.hash});
  } else {
    res.json({loggedIn: false, userHash: null});
  }
});

module.exports = router;
