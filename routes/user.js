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
passport.use('login', new LocalStrategy({
    passReqToCallback : true,
		usernameField : 'signin-username',
		passwordField : 'signin-password'
  },
  function(req, username, password, done) {

    User.findOne({
      name: username

    }).then(user => {
      if (!user) {
        done(null, false, {message: 'User does not exist'});
      }
      else if (user.checkPassword(password)) {
        done(null, user);
      } else {
        done(null, false, {message: 'Incorrect password'});
      }

    }).catch(err => {
      done(err, false);

    });
	}
));
router.post('/login', passport.authenticate('login'));

passport.use('signup', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'signup-username',
    passwordField: 'signup-password'
  },
  function(req, username, password, done) {

    new User({
      name: username,
      email: req.body['signup-email'],
      password: password

    })
    .save((err, user) => {
      if (err) {
        done(err, false);
      } else {
        done(null, user);
      }
    });
  }
));

router.post('/new', function(req, res, next) {
  if (req.body['signup-username'] === 'local') {
    res.status(400).json({error: 'Username must be unique'});
  }
  passport.authenticate('signup', function(err, user) {
    if (err && err.code === 11000) {
      res.status(400).json({error: 'Username must be unique'});
    } else if (err) {
      next(err);
    } else if (user) {
      req.logIn(user, (err) => {next(err)});
    } else {
      res.status(400).json({error: 'Incomplete information supplied'});
    }
  })(req, res, next);
});



router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

/**
* This is a special route that just tells us whether a given user exists
*/
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
    res.json({user: req.user.name});
  } else {
    res.json({user: null});
  }
});

module.exports = router;
