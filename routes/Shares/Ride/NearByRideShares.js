const express = require("express");
const router = express.Router();
const {
  createShare,
  getUserNearByRideShares,
} = require("../../../controllers/Shares/Ride/NearByRideShares");

router.route("/createNearByRideShare").post(createShare);
router.route("/getUserNearByRideShares").get(getUserNearByRideShares);

module.exports = router;
