const express = require("express");
const auth = require("../routes/auth");
const users = require("../routes/users");
const userRides = require("../routes/Assets/Ride");
const nearByRideShares = require("../routes/Shares/Ride/NearByRideShares");
const cityToCityRideShares = require("../routes/Shares/Ride/CityToCityRideShares");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/v1/users", users);
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/userRides", userRides);
  app.use("/api/v1/nearByRideShares", nearByRideShares);
  app.use("/api/v1/cityToCityRideShares", cityToCityRideShares);
};
