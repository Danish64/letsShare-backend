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
  updateUserName,
  updateProfilePicture,
  updateUserPhone,
  updateUserCity,
  updateUserHomeAddress,
  updateUserWorkAddress,
} = require("../controllers/users");

router.route("/registerUser").post(registerUser);
router.route("/checkEmail").post(getUserWithEmail);
router.route("/loggedInUser").get(auth, getLoggedInUser);
router.route("/getUsers").get(getUsers);
router.route("/updateUserName").put(updateUserName);
router.route("/updateProfilePicture").put(updateProfilePicture);
router.route("/updateUserPhone").put(updateUserPhone);
router.route("/updateUserCity").put(updateUserCity);
router.route("/updateUserHomeAddress").put(updateUserHomeAddress);
router.route("/updateUserWorkAddress").put(updateUserWorkAddress);
router.route("/:id").get(getUser);

module.exports = router;
