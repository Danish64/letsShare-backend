const express = require("express");
const router = express.Router();
const {
  createUserRide,
  getUserRides,
} = require("../../controllers/Assets/Ride");

router.route("/createRide").post(createUserRide);
router.route("/getUserRides").post(getUserRides);

module.exports = router;
