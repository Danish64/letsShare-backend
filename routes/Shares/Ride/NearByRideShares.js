const express = require("express");
const router = express.Router();
const {
  createShare,
  getUserNearByRideShares,
  createNearByBooking,
  acceptNearByBooking,
  getAllNearByRideShares,
} = require("../../../controllers/Shares/Ride/NearByRideShares");

router.route("/createNearByRideShare").post(createShare);
router.route("/getUserNearByRideShares").post(getUserNearByRideShares);
router.route("/acceptNearByRidesSharesBooking").put(acceptNearByBooking);
router.route("/createNearByRidesSharesBooking/:id").post(createNearByBooking);
router.route("/getAllNearByRides").get(getAllNearByRideShares);

module.exports = router;
