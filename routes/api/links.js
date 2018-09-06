const router = require("express").Router();
const mongoose = require("mongoose");
const Link = mongoose.model("Link");
const User = mongoose.model("User");
const auth = require("../auth");

router.get("/", auth.optional, (req, res, next) => {
  const query = {};
  let limit = 20;
  const offset = 0;

  if (typeof req.query.limit !== "undefined") {
    limit = req.query.limit;
  }

  if (typeof req.query.offset !== "undefined") {
    offset = req.query.offset;
  }

  if (typeof req.query.tag !== "undefined") {
    query.tagList = { $in: [req.query.tag] };
  }

  Promise.all([
    req.query.author ? User.findOne({ username: req.query.author }) : null,
    req.query.favorited ? User.findOne({ username: req.query.favorited }) : null
  ])
    .then(function(results) {
      const author = results[0];
      const favoriter = results[1];

      if (author) {
        query.author = author._id;
      }

      if (favoriter) {
        query._id = { $in: favoriter.favorites };
      } else if (req.query.favorited) {
        query._id = { $in: [] };
      }

      return Promise.all([
        Link.find(query)
          .limit(Number(limit))
          .skip(Number(offset))
          .sort({ createdAt: "desc" })
          .populate("author")
          .exec(),
        Link.count(query).exec(),
        req.payload ? User.findById(req.payload.id) : null
      ]).then(function(results) {
        const links = results[0];
        const linksCount = results[1];
        const user = results[2];

        return res.json({
          links: links.map(function(link) {
            return link.toJSONFor(user);
          }),
          linksCount: linksCount
        });
      });
    })
    .catch(next);
});

router.post("/", auth.required, function(req, res, next) {
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }

      const link = new Link(req.body.link);
      link.author = user;

      return link.save().then(function() {
        console.log(link.author);
        return res.json({ link: link.toJSONFor(user) });
      });
    })
    .catch(next);
});

module.exports = router;
