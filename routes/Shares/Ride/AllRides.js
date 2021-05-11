const express = require("express");
const router = express.Router();
const {
  getUserRidesShares,
  getUserAvailedRides,
} = require("../../../controllers/Shares/Ride/AllRides");

router.route("/").post(getUserRidesShares);
router.route("/userAvailedRides").post(getUserAvailedRides);

module.exports = router;
