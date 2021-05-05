const auth = require("../middleware/auth");
// const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();
const {
  registerUser,
  getUser,
  getUserWithEmail,
  getUsers,
  getLoggedInUser,
} = require("../controllers/users");

router.route("/registerUser").post(registerUser);
router.route("/checkEmail").post(getUserWithEmail);
router.route("/loggedInUser").get(auth, getLoggedInUser);
router.route("/getUsers").get(getUsers);
router.route("/:id").get(getUser);

module.exports = router;
