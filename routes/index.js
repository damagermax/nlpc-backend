const express = require("express");
const router = express.Router();

const auth = require("./auth.route");
const user = require("./user.route");
const podcast = require("./podcast.route");

router.use("/auth", auth);
router.use("/users", user);
router.use("/podcast", podcast);

module.exports = router;
