const express = require("express");
const router = express.Router();
const {
  createShare,
  createTourRideShareBooking,
  getAllTourRideShares,
  getUserTourRideShares,
  acceptTourRideShareBooking,
} = require("../../../controllers/Shares/Ride/TourRideShares");

router.route("/createTourRideShare").post(createShare);
router.route("/getUserTourRideShares").post(getUserTourRideShares);
router.route("/acceptTourRideSharesBooking").put(acceptTourRideShareBooking);
router
  .route("/createTourRideSharesBooking/:id")
  .post(createTourRideShareBooking);
router.route("/getAllTourRides").get(getAllTourRideShares);

module.exports = router;
