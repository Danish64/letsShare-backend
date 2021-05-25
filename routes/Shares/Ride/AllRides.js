const express = require("express");
const router = express.Router();
const {
  getUserRidesShares,
  getUserAvailedRides,
  getAllRideShares,
} = require("../../../controllers/Shares/Ride/AllRides");

router.route("/").post(getUserRidesShares);
router.route("/userAvailedRides").post(getUserAvailedRides);
router.route("/getAllRideShares").post(getAllRideShares);

module.exports = router;
