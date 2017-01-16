var express = require('express');
var router = express.Router();

const Wikode = require('../models/Wikode');

router.all('/:user/:slug', function(req, res, next) {

  req.context.view = 'Editor';
  next();

});

/**
 * Save a Wikode and return it in its current form
 */
router.post('/:user/:slug', function(req, res, next) {

  // check if the requested user is the same as the authenticated user, otherwise
  // send back an error
  const user = req.user ? req.user.name : null;

  if (req.params.user !== user && req.params.user !== 'local') {
    var err = new Error('Unauthorized');
    err.status = 401;
    return next(err);
  }

  // DECISION: what to do if this user already has a wikode with the same slug
  new Wikode({
    user: user,
    title: req.body.title,
    slug: req.body.slug,
    content: req.body.content,
    datetime: new Date().toISOString() // move into a save hook on the model
  }).save().then(wikode => {

    req.context.state.wikode = {
      user: wikode.user,
      title: wikode.title,
      slug: wikode.slug,
      content: wikode.content,
      datetime: wikode.datetime
    }

    next();
  }).catch(err => {next(err)});
});


/**
 * populate data for the Editor view
 */
router.get('/:user/:slug', function(req, res, next) {


  // if we are local document instead of a user, bounce back to the browser
  // to handle population of the data
  if (req.params.user === "local") {
    req.context.state.wikode = {
      slug: req.params.slug,
      user: "local"
    }
    return next();
  }

  // find the CURRENT LATEST Wikode (we may generate a new version before we send)
  Wikode.find({
    user: req.params.user,
    slug: req.params.slug
  }).sort({datetime: -1}).limit(1).then(results => {

    if (results.length === 0) {
      var err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }

    const wikode = results[0];
    req.context.state.wikode = {
      user: wikode.user,
      title: wikode.title,
      slug: wikode.slug,
      content: wikode.content,
      datetime: wikode.datetime
    }

    next();
  }).catch(err => next(err));
});





/* GET home page. */
router.get('/', function(req, res, next) {
  req.context.view = 'Home';
  next();
});


module.exports = router;
