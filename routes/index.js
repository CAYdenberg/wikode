var express = require('express');
var router = express.Router();
const randomstring = require('randomstring').generate;

const Wikode = require('../models/Wikode');



router.post('/:user/:slug', function(req, res, next) {
  // check if the current user already has that document
  // if they don't create a new blank document
  // if they do send a warning
});

router.put('/:user/:slug', function(req, res, next) {
  // check if the current user is signed in
  // if yes, save
  const content = req.body;
  const wikode = new Wikode({
    user: req.params.user,
    slug: req.params.slug,
    datetime: new Date().toISOString(), //TODO: move this into a save hook on the Model
    content: content
  }).save().then(() => {
    next();
  });
  // if no, offer to create a new document
});

router.all('/:user/:slug', function(req, res, next) {

  req.context.template = 'editor';

  Wikode.find({
    user: req.params.user,
    slug: req.params.slug
  }).sort({datetime: -1}).limit(1).then(results => {

    const wikode = results[0];

    if (results.length === 0) {
      res.status(404).render('404');
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
    user: 'anon',
    datetime: new Date().toISOString(),
    slug: randomstring(8)
  }).save().then(wikode => {
    res.redirect('/' + wikode.user + '/' + wikode.slug + '/');
  });

});

/* GET home page. */
router.get('/', function(req, res, next) {
  req.context.template = 'index';
  next();
});

router.all('*', function(req, res, next) {
  const template = req.context.template || 'index'

  if (req.accepts('text/html')) {
    res.render(template, req.context);
  } else {
    res.json(req.context.data);
  }
});

module.exports = router;
