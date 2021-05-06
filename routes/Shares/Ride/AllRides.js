const express = require("express");
const router = express.Router();
const {
  getUserRidesShares,
} = require("../../../controllers/Shares/Ride/AllRides");

router.route("/").post(getUserRidesShares);

module.exports = router;
