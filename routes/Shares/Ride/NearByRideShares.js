const express = require("express");
const { isObject } = require("underscore");
const router = express.Router();
const {
  createShare,
  getUserNearByRideShares,
  createNearByBooking,
  acceptNearByBooking,
  getAllNearByRideShares,
  deleteShare,
} = require("../../../controllers/Shares/Ride/NearByRideShares");

module.exports = function (io) {
  router.route("/createNearByRideShare").post(createShare(io));
  router.route("/deleteNearByRideShare").delete(deleteShare);
  router.route("/getUserNearByRideShares").post(getUserNearByRideShares);
  router.route("/acceptNearByRidesSharesBooking").put(acceptNearByBooking(io));
  router
    .route("/createNearByRidesSharesBooking/:id")
    .post(createNearByBooking(io));
  router.route("/getAllNearByRides").post(getAllNearByRideShares);

  return router;
};
