var express = require('express');
var router = express.Router();
const React = require('react');
const ReactRender = require('react-dom/server').renderToString;

const reducer = require('../store/reducer');
const createStore = require('redux').createStore;
const makeTemplate = require('../components');

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
      req.context.state.editMode = true;
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
  new Wikode({
    user: req.params.user,
    slug: req.params.slug,
    datetime: new Date().toISOString(), //TODO: move this into a save hook on the Model
    content: content
  }).save().then(wikode => {
    req.context.state.wikode = wikode;
    next();
  }).catch(err => next(err));
});


router.all('/:user/:slug', function(req, res, next) {

  req.context.template = 'Editor';

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

    req.context.state.wikode = {
      userHash: wikode.user,
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

  new Wikode({
    user: req.session.user.hash,
    datetime: new Date().toISOString(),
    slug: randomstring(8)
  }).save().then(wikode => {
    res.redirect('/' + wikode.user + '/' + wikode.slug + '/');
  }).catch(err => {next(err)});

});


/* GET home page. */
router.get('/', function(req, res, next) {
  req.context.template = 'Home';
  next();
});


router.all('*', function(req, res) {
  const store = createStore(reducer, req.context.state);
  const templateName = req.context.template || 'Home';
  const template = makeTemplate(templateName, store);

  if (req.accepts('text/html')) {
    req.context.reactHtml = ReactRender(template);
    res.render('index', req.context);
  } else {
    res.json(req.context.state);
  }

});


module.exports = router;
