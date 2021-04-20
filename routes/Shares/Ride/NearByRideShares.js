const express = require("express");
const router = express.Router();
const {
  createShare,
  getUserNearByRideShares,
  createNearByBooking,
  acceptNearByBooking,
} = require("../../../controllers/Shares/Ride/NearByRideShares");

router.route("/createNearByRideShare").post(createShare);
router.route("/getUserNearByRideShares").get(getUserNearByRideShares);
router.route("/createNearByRidesSharesBooking/:id").post(createNearByBooking);
router.route("/acceptNearByRidesSharesBooking").put(acceptNearByBooking);

module.exports = router;
