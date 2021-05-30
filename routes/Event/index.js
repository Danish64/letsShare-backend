const express = require("express");
const router = express.Router();
const {
  createEvent,
  getUserCreatedEvents,
  getAllEvents,
  createEventSharings,
  getEventShares,
} = require("../../controllers/Event");

module.exports = function (io) {
  router.route("/createEvent").post(createEvent(io));
  router.route("/getUserCreatedEvents").post(getUserCreatedEvents);
  router.route("/createEventSharings/:id").post(createEventSharings(io));
  router.route("/getAllEvents").post(getAllEvents);
  router.route("/getEventShares").post(getEventShares);

  return router;
};
