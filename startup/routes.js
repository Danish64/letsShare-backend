const express = require("express");
const auth = require("../routes/auth");
const users = require("../routes/users");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/v1/users", users);
  app.use("/api/v1/auth", auth);
};
