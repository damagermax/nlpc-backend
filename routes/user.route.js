const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

const { getAllUsers, getSingleUser } = require("../controllers/user.controller");

router.use(protect);

router.route("/").get(getAllUsers);
router.get("/:id", getSingleUser);

module.exports = router;
