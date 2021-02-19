// const auth = require("../middleware/auth");
// const admin = require("../middleware/admin");

const { get } = require("config");
const express = require("express");
const router = express.Router();
const {
  registerUser,
  getUser,
  getUserWithEmail,
} = require("../controllers/users");
const auth = require("../middleware/auth");

router.route("/").get(getUserWithEmail, auth).post(registerUser);
router.route("/:id").get(getUser);

module.exports = router;
