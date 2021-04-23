const express = require("express");
const auth = require("../routes/auth");
const users = require("../routes/users");

//Ride routes
const userRides = require("../routes/Assets/Ride");
const nearByRideShares = require("../routes/Shares/Ride/NearByRideShares");
const cityToCityRideShares = require("../routes/Shares/Ride/CityToCityRideShares");
const tourRideShares = require("../routes/Shares/Ride/TourRideShares");

//Goods Routes

const userGoods = require("../routes/Assets/Good");
const goodShares = require("../routes/Shares/Good");
//Foods Routes

const userFoods = require("../routes/Assets/Food");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/v1/users", users);
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/userRides", userRides);
  app.use("/api/v1/nearByRideShares", nearByRideShares);
  app.use("/api/v1/cityToCityRideShares", cityToCityRideShares);
  app.use("/api/v1/tourRideShares", tourRideShares);
  app.use("/api/v1/userGoods", userGoods);
  app.use("/api/v1/goodShares", goodShares);
  app.use("/api/v1/userFoods", userFoods);
};
