const express = require("express");
const router = express.Router();
const {
  createShare,
  getUserNearByRideShares,
  createNearByBooking,
} = require("../../../controllers/Shares/Ride/NearByRideShares");

router.route("/createNearByRideShare").post(createShare);
router.route("/getUserNearByRideShares").get(getUserNearByRideShares);
router.route("/createNearByRidesSharesBooking/:id").post(createNearByBooking);

module.exports = router;
