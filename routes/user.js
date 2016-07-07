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
        done(null, false, {message: 'Incorrect password'});
      }
    }).catch(err => {
      done(err, false);
    });
	}
));

router.post('/login', passport.authenticate('local'));

router.post('/new', function(req, res, next) {
  // confirm that the session hash matches the submitted hash
  if (req.user.hash !== req.body.hash) {
    return res.status(400).send({});
  }

  User.findOne({hash: req.user.hash}).then(user => {

    //check if this User has already been created
    if (user.name || user.email || user.password) {
      return res.status(401).json({error: 'A user is already logged in'});
    }

    Object.assign(user, {
      name: req.body['signup-username'],
      email: req.body['signup-email'],
      password: req.body['signup-password']
    });
    user.save().then(user => {
      req.login(user, next);
    }).catch(err => {
      res.status(401).json({error: 'User could not be created'});
    });

  }).catch(err => next(err));
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
