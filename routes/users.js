const auth = require("../middleware/auth");
// const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();
const {
  registerUser,
  getUser,
  getUserWithEmail,
  getLoggedInUser,
} = require("../controllers/users");

router.route("/registerUser").post(registerUser);
router.route("/checkEmail").get(getUserWithEmail);
router.route("/loggedInUser").get(auth, getLoggedInUser);
router.route("/:id").get(getUser);

module.exports = router;
