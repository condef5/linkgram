const router = require('express').Router();
const Link = require('mongoose').model('Link');


router.get('/', function(req, res, next) {
  Link.find().distinct('tagList').then(function(tags) {
    return res.json({ tags: tags });
  }).catch(next);
});

module.exports = router;
