const router = require("express").Router();
const mongoose = require("mongoose");
const Link = mongoose.model("Link");
const request = require("request");

router.get("/", (req, res) => {
  Link.find().then(links => {
    return res.json({ links: links });
  });
});

router.post("/", (req, res, next) => {
  const link = new Link(req.body);
  return link
    .save()
    .then(() => {
      return res.json({ link: link.toJSONFor() });
    })
    .catch(next);
});

module.exports = router;
