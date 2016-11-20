var express = require('express');
var router = express.Router();

const Wikode = require('../models/Wikode');


/**
 * populate data for the Editor view
 */
router.all('/:user/:slug', function(req, res, next) {

  req.context.view = 'Editor';

  // if we are local document instead of a user, bounce back to the browser
  // to handle population of the data
  if (req.params.user === "local") {
    req.context.state.wikode = {
      slug: req.params.slug,
      user: "local"
    }
    next();
  }

  // find the CURRENT LATEST Wikode (we may generate a new version before we send)
  Wikode.find({
    user: req.params.user,
    slug: req.params.slug
  }).sort({datetime: -1}).limit(1).then(results => {

    if (results.length === 0) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    }

    req.context.state.wikode = results[0];

    next();
  }).catch(err => next(err));

});


/**
 * Save an existing Wikode.
 * Creates a new record with the same title and user and a current datetime
 */
router.put('/:user/:slug', function(req, res, next) {

  // check if the session user is the owner of the document
  // if no, return a 400 or 401
  if (req.user.hash !== req.context.state.wikode.user) {
    return res.status(401).send({});
  }

  // if yes, save the document
  const content = req.body;
  new Wikode({
    title: req.context.state.wikode.title,
    user: req.context.state.wikode.user,
    slug: req.context.state.wikode.slug,
    datetime: new Date().toISOString(), //TODO: move this into a save hook on the Model
    content: content
  }).save().then(wikode => {
    req.context.state.wikode = wikode;
    next();
  }).catch(err => next(err));

});


/**
 * Create a new Wikode for the currently authenticated user.
 */
router.post('/:user/:slug', function(req, res, next) {

  // check if the requested user is the same as the authenticated user, otherwise
  // send back an error

  // save ALL the data as a new document and send it back

  // check if the current user already has that document
  Wikode.findOne({
    user: req.user.hash,
    slug: req.context.state.wikode.slug
  }).then(duplicate => {

    // if they do send them over to it
    if (duplicate) {
      return res.redirect('/' + duplicate.user + '/' + duplicate.slug + '/');

    // if they don't create a new blank document
    } else {
      new Wikode({
        user: req.user.hash,
        slug: req.context.state.wikode.slug,
        content: req.context.state.wikode.content,
        datetime: new Date().toISOString()
      }).save().then(wikode => {

        // and redirect the user to their new document
        return res.redirect('/' + wikode.user + '/' + wikode.slug + '/');

      });
    }
  }).catch(err => {next(err)});
});


/* GET home page. */
router.get('/', function(req, res, next) {
  req.context.view = 'Home';
  next();
});


module.exports = router;
