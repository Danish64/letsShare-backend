const express = require("express");
const router = express.Router();
const {
  createShare,
  getUserNearByRideShares,
  createNearByBooking,
  acceptNearByBooking,
  getAllNearByRideShares,
} = require("../../../controllers/Shares/Ride/NearByRideShares");

module.exports = function (io, socketId) {
  router.route("/createNearByRideShare").post(createShare(io));
  router.route("/getUserNearByRideShares").post(getUserNearByRideShares);
  router
    .route("/acceptNearByRidesSharesBooking")
    .put(acceptNearByBooking(io, socketId));
  router
    .route("/createNearByRidesSharesBooking/:id")
    .post(createNearByBooking(io, socketId));
  router.route("/getAllNearByRides").post(getAllNearByRideShares);

  return router;
};
