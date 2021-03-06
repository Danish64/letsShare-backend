const express = require("express");
const router = express.Router();
const {
  createShare,
  getUserCityToCityRideShares,
  getAllCityToCityRideShares,
  createCityToCityBooking,
  acceptCityToCityBooking,
} = require("../../../controllers/Shares/Ride/CityToCityShares");

router.route("/createCityToCityRideShare").post(createShare);
router.route("/getUserCityToCityRideShares").post(getUserCityToCityRideShares);
router.route("/acceptCityToCityRideSharesBooking").put(acceptCityToCityBooking);
router
  .route("/createCityToCityRideSharesBooking/:id")
  .post(createCityToCityBooking);
router.route("/getAllCityToCityRides").post(getAllCityToCityRideShares);

module.exports = router;
