

/**
 * GET /api
 * List of API examples.
 */
module.exports.getApi = (req, res) => {
  res.render('api/index', {
    title: 'API Examples'
  });
};
