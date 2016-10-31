var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

const { slugify } = require('../lib');

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
        done(null, false, {message: 'Incorrect password'});
      }
    }).catch(err => {
      done(err, false);
    });
	}
));

router.post('/login', passport.authenticate('local'));

router.post('/new', function(req, res, next) {

  const name = req.body['signup-username'];

  new User({
    name: name,
    email: req.body['signup-email'],
    password: req.body['signup-password'],
    hash: slugify(name)

  }).save().then(user => {
    req.login(user, next);

  }).catch(err => {
    console.log(err);
    res.status(401).json({error: 'User could not be created'});

  });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
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
    res.json({loggedIn: true, userHash: req.user.hash, username: req.user.name});
  } else {
    res.json({loggedIn: false, userHash: req.user.hash, username: req.user.name});
  }
});

module.exports = router;
