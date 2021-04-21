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
router.route("/getUserCityToCityRideShares").get(getUserCityToCityRideShares);
router.route("/acceptCityToCityRideSharesBooking").put(acceptCityToCityBooking);
router
  .route("/createCityToCityRideSharesBooking/:id")
  .post(createCityToCityBooking);
router.route("/getAllCityToCityRides").get(getAllCityToCityRideShares);

module.exports = router;
