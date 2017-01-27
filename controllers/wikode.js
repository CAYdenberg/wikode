const Wikode = require('../models/Wikode');

const {slugify} = require('../lib');

function getUsername(req) {
  return req.user ? req.user.profile.name : null;
}

/**
 * Save a Wikode and return it in its current form
 */
exports.post = (req, res, next) => {
  const user = getUsername(req);
  if (!user) {
    var err = new Error('Unauthorized');
    err.status = 401;
    return next(err);
  }

  Wikode.create({
    user: user,
    title: req.body['new-wikode-title'],
    slug: slugify(req.body['new-wikode-title']),
    content: null,
    datetime: new Date().toISOString() // move into a save hook on the model
  }).then(wikode => {

    // TODO: schedule the redirect and do it at final step
    res.locals.state.wikode = {
      user: wikode.user,
      title: wikode.title,
      slug: wikode.slug,
      content: wikode.content,
      datetime: wikode.datetime
    }

    res.redirect('/wikode/' + wikode.user + '/' + wikode.slug);
  }).catch(err => {next(err)});
};

exports.put = (req, res, next) => {
  // check if the requested user is the same as the authenticated user, otherwise
  // send back an error
  const user = getUsername(req);
  if (!user) {
    var err = new Error('Unauthorized');
    err.status = 401;
    return next(err);
  }

  // DECISION: what to do if this user already has a wikode with the same slug
  Wikode.create({
    user: user,
    title: req.body.title,
    slug: req.body.slug,
    content: req.body.content || null,
    datetime: new Date().toISOString() // move into a save hook on the model
  }).then(wikode => {

    res.locals.view = 'Editor';
    res.locals.state.wikode = {
      user: wikode.user,
      title: wikode.title,
      slug: wikode.slug,
      content: wikode.content,
      datetime: wikode.datetime
    }

    next();
  }).catch(err => {next(err)});
};

/**
 * populate data for the Editor view
 */
exports.get = (req, res, next) => {
  // make sure we can get back here after a successful login
  req.session.returnTo = req.path;

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
    res.locals.state.wikode = {
      user: wikode.user,
      title: wikode.title,
      slug: wikode.slug,
      content: wikode.content,
      datetime: wikode.datetime
    }

    res.locals.view = 'Editor';
    next();
  }).catch(err => next(err));
};
