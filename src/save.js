const popsicle = require('popsicle');

module.exports = (user, slug, data) => {
  popsicle.request({
    method: 'PUT',
    url: '/' + user + '/' + slug + '/',
    body: data
  });
}
