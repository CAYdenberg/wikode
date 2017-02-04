/**
 * GET /
 * Home page.
 */
exports.index = (req, res, next) => {
  res.locals.redirect = '/wikode/@CAYdenberg/this-is-a-wikode';
  next();
};
