const express = require("express");
const auth = require("../routes/auth");
const users = require("../routes/users");

//Ride routes
const userRides = require("../routes/Assets/Ride");
const nearByRideShares = require("../routes/Shares/Ride/NearByRideShares");
const cityToCityRideShares = require("../routes/Shares/Ride/CityToCityRideShares");
const tourRideShares = require("../routes/Shares/Ride/TourRideShares");
const allRidesShares = require("../routes/Shares/Ride/AllRides");

//Goods Routes

const userGoods = require("../routes/Assets/Good");
const goodShares = require("../routes/Shares/Good");
//Foods Routes

const userFoods = require("../routes/Assets/Food");
const foodShares = require("../routes/Shares/Food");

//Space Routes
const userSpaces = require("../routes/Assets/Space");
const residenceSpaceShares = require("../routes/Shares/Space/Residence");
const allSpaceShares = require("../routes/Shares/Space/AllSpaces");

module.exports = function (app, io) {
  app.use(express.json());
  app.use("/api/v1/users", users);
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/userRides", userRides);
  app.use("/api/v1/nearByRideShares", nearByRideShares(io));
  app.use("/api/v1/cityToCityRideShares", cityToCityRideShares);
  app.use("/api/v1/tourRideShares", tourRideShares);
  app.use("/api/v1/userRides", allRidesShares);
  app.use("/api/v1/userGoods", userGoods);
  app.use("/api/v1/goodShares", goodShares);
  app.use("/api/v1/userFoods", userFoods);
  app.use("/api/v1/foodShares", foodShares);
  app.use("/api/v1/userSpaces", userSpaces);
  app.use("/api/v1/residenceSpaceShares", residenceSpaceShares);
  app.use("/api/v1/allSpaces", allSpaceShares);
};
