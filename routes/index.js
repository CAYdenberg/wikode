var express = require('express');
var router = express.Router();
const React = require('react');
const ReactRender = require('react-dom/server').renderToString;

const randomstring = require('randomstring').generate;

const Wikode = require('../models/Wikode');
const User = require('../models/User');


router.all('/:user/:slug', function(req, res, next) {
  // find the user specified in the URL by either their hash or their name
  User.findOne({
    $or: [
      {hash: req.params.user},
      {name: req.params.user}
    ]
  }).then(user => {
    // check if the user parameter is a hash for a user who already is registered
    // if so redirect (301) to the page within the user's profile
    if (user.name && user.name !== req.params.user) {
      res.status(301).redirect('/' + user.name + '/' + req.params.slug);
    }

    // check if the session user is the same as the user URL parameter.
    // if yes turn edit mode on
    if (req.session.user === user) {
      req.context.data.editMode = true;
    }
    next();
  }).catch(err => next(err));
});


router.post('/:user/:slug', function(req, res, next) {
  // check if the current user already has that document
  // if they don't create a new blank document
  // if they do send a warning
});


router.put('/:user/:slug', function(req, res, next) {
  // check if the :user is the same as the session user
  // if no, return a 400 or 401
  // if yes, save the document
  const content = req.body;
  const wikode = new Wikode({
    user: req.params.user,
    slug: req.params.slug,
    datetime: new Date().toISOString(), //TODO: move this into a save hook on the Model
    content: content
  }).save().then(() => {
    next();
  }).catch(err => next(err));
});


router.all('/:user/:slug', function(req, res, next) {

  req.context.template = 'editor';

  Wikode.find({
    user: req.params.user,
    slug: req.params.slug
  }).sort({datetime: -1}).limit(1).then(results => {

    const wikode = results[0];

    if (results.length === 0) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    }

    req.context.data = {
      user: wikode.user,
      slug: wikode.slug,
      content: wikode.content
    };

    next();
  });

});


router.post('/', function(req, res, next) {
  // generate a document with user:anonymous and string:random
  // save it to DB with empty array as content
  // redirect to the route for that document

  const wikode = new Wikode({
    user: req.session.user.hash,
    datetime: new Date().toISOString(),
    slug: randomstring(8)
  }).save().then(wikode => {
    res.redirect('/' + wikode.user + '/' + wikode.slug + '/');
  });

});


/* GET home page. */
router.get('/', function(req, res, next) {
  req.context.template = 'Home';
  next();
});


router.all('*', function(req, res, next) {
  const template = req.context.template || 'Home';

  if (req.accepts('text/html')) {
    const component = require('../components/' + template);
    req.context.reactHtml = ReactRender(React.createElement(component, req.context.data));
    res.render('index', req.context);
  } else {
    res.json(req.context.data);
  }

});


module.exports = router;
