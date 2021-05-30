const { Event } = require("../../models/Event");
const { User } = require("../../models/user");
var _ = require("lodash");
exports.createEvent = function (io) {
  console.log("createEvent");
  return async (req, res) => {
    console.log("createEvent Route Called");
    try {
      let event = new Event(req.body);

      let user = await User.findById(req.body.managerId);

      if (!user) {
        return res
          .status(200)
          .send({ status: "error", errorCode: 400, message: "Wrong user id" });
      }

      await event.save();

      //Broadcast Event
      io.emit("events:newEvent", event);

      res.status(200).send({
        status: "success",
        data: event,
        message: "event Successfully Created",
      });
    } catch (err) {
      res
        .status(200)
        .send({ status: "success", errorCode: 500, message: err.message });
    }
  };
};
exports.getUserCreatedEvents = async (req, res) => {
  console.log("getUserCreatedEvents Route Called");
  // console.log("Socket Id", socketId);
  try {
    let events = await Event.find({
      managerId: { $in: [req.body.managerId] },
    });
    if (events)
      return res.status(200).send({
        status: "success",
        data: events,
        message: "User's Events",
      });

    res.status(200).send({
      status: "success",
      data: [],
      message: "User have no events!",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.getAllEvents = async (req, res) => {
  console.log("getAllEvents Route Called");

  try {
    let events = await Event.find({
      isEnded: false,
      managerId: { $ne: req.body.userId },
    });
    if (!events)
      return res.status(200).send({
        status: "success",
        data: [],
        message: "No events available",
      });

    res.status(200).send({
      status: "success",
      data: events,
      message: "All events",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.getEventById = async (req, res) => {
  console.log("getSingleEvent Route Called");

  try {
    let event = await Event.findById(req.body.id);
    if (!event)
      return res.status(200).send({
        status: "success",
        data: "",
        message: "Wrong Event Id",
      });

    res.status(200).send({
      status: "success",
      data: event,
      message: "Event by id",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.createEventSharings = function (io) {
  return async (req, res) => {
    console.log("createEventSharings Route Called");
    console.log("SocketId in createEventSharings", socketId);

    try {
      let event = await Event.findById(req.params.id);

      if (event.isEnded) {
        return res.status(200).send({
          status: "Error",
          errorCode: 400,
          message: "Event is not available.",
        });
      }

      const newSharing = { ...req.body };

      let socketSharings = [...event.sharings];
      if (event.sharings) {
        event.sharings.unshift(newSharing);
        socketSharings.unshift(newSharing);
      } else {
        let sharings = [];
        sharings.unshift(newSharing);
        event.sharings = sharings;
        socketSharings.unshift(newSharing);
      }

      event.save();

      if (socketId) {
        //emit event on socket id to listen for the created booking
        io.to(socketId).emit("event:newEventSharing", socketSharings);
      }

      return res.status(200).send({
        status: "success",
        data: event.sharings,
        message: "New sharing created",
      });
    } catch (err) {
      return res
        .status(200)
        .send({ status: "Error", errorCode: 500, message: err.message });
    }
  };
};
