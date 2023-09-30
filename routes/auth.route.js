const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");

const {
  register,
  login,
  currentUser,
  forgotPassword,
  updatepassword,
} = require("../controllers/auth.controller");

/**
 * @access  Public
 */

router.post("/login", login);
router.post("/register", register);
router.post("/forgotpassword", forgotPassword);

/**
 * @access  Private - authenticated users only
 */

router.use(protect);

router.put("/updatepassword", updatepassword);
router.get("/me", currentUser);

module.exports = router;
