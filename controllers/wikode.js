

function getUsername(req) {
  return req.user ? req.user.profile.name : null;
}


function Controller(model) {
  this.model = model;

  this.findFromReq = (req) => {
    return this.model.findOne({
      user: req.params.user,
      slug: req.params.slug
    }).then(wikode => {
      if (!wikode) {
        var err = new Error('Not Found');
        err.status = 404;
        return Promise.reject(err);
      }
      return wikode;
    });
  }

  this.filterResponseData = (wikode) => {
    return {
      user: wikode.user,
      title: wikode.title,
      slug: wikode.slug,
      content: wikode.content,
      datetime: wikode.datetime
    }
  }

  this.post = (req, res, next) => {
    const user = getUsername(req);
    if (!user) {
      var err = new Error('Unauthorized');
      err.status = 401;
      return next(err);
    }

    this.model.create({
      user: user,
      title: req.body['new-wikode-title']

    }).then(wikode => {
      res.locals.redirect = `/wikode/${wikode.user}/${wikode.slug}/`;
      res.locals.state.wikode = this.filterResponseData(wikode);
      return next();

    }).catch(err => next(err));
  };

  this.fork = (req, res, next) => {
    const user = getUsername(req);
    if (!user) {
      var err = new Error('Unauthorized');
      err.status = 401;
      return next(err);
    }

    this.findFromReq(req).then(wikode => {
      return this.model.create({
        title: wikode.title,
        slug: wikode.slug,
        content: wikode.content,
        user: user
      }).catch(err => {
        if (err.code === 11000) {
          err.message = 'You already have a Wikode with the same or a similar title';
          err.status = 400;
        }
        return Promise.reject(err);

      });
    }).then(newWikode => {
      res.locals.redirect = `/wikode/${newWikode.user}/${newWikode.slug}/`;
      res.locals.state.wikode = this.filterResponseData(newWikode);
      return next();

    }).catch(err => next(err));
  }

  this.put = (req, res, next) => {
    // check if the requested user is the same as the authenticated user, otherwise
    // send back an error
    const user = getUsername(req);
    if (!user || user !== req.params.user) {
      var err = new Error('Unauthorized');
      err.status = 401;
      return next(err);
    }

    this.findFromReq(req).then(wikode => {
      wikode.content = req.body.content;
      return wikode.save();

    }).then(wikode => {
      res.locals.view = 'Editor';
      res.locals.title = wikode.title;
      res.locals.state.wikode = this.filterResponseData(wikode);
      return next();

    }).catch(err => next(err));
  };

  this.get = (req, res, next) => {
    // make sure we can get back here after a successful login
    req.session.returnTo = req.path;

    this.findFromReq(req).then(wikode => {
      res.locals.view = 'Editor';
      res.locals.title = wikode.title;
      res.locals.state.wikode = this.filterResponseData(wikode);
      return next();

    }).catch(err => next(err));
  };
}

exports.default = module.exports = (model) => new Controller(model);
