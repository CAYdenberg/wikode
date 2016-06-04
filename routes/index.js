var express = require('express');
var router = express.Router();
const randomstring = require('randomstring').generate;

const Wikode = require('../models/Wikode');



router.post('/:user/:doc', function(req, res, next) {
  // check if the current user already has that document
  // if they don't create a new blank document
  // if they do send a warning
});

router.put('/:user/:doc', function(req, res, next) {
  // check if the current user is signed in
  // if yes, save
  // if no, offer to create a new document
});

router.get('/:user/:doc', function(req, res, next) {
  req.context.template = 'editor';
  // show the selected document
  // edit mode can be on or off
});

router.post('/', function(req, res, next) {
  // generate a document with user:anonymous and string:random
  // save it to DB with empty array as content
  // redirect to the route for that document

  const wikode = new Wikode({
    user: 'anon',
    slug: randomstring(8)
  }).save().then(wikode => {
    res.send();
  });

});

/* GET home page. */
router.get('/', function(req, res, next) {
  req.context.template = 'index';
  next();
});

router.all('*', function(req, res, next) {
  if (req.accepts('text/html')) {
    res.render(req.context.template, req.context);
  } else {
    res.json(req.context.data);
  }
});

module.exports = router;
