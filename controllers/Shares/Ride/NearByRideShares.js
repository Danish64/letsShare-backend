const { NearByRideShare } = require("../../../models/Shares/Ride/NearByRide");
const {
  UserAvailedRides,
} = require("../../../models/Shares/Ride/UserAvailedRides");
const { User } = require("../../../models/user");
var {
  sendGlobalNotification,
  sendIndividualNotification,
} = require("../../../helpers/Notifications");

var _ = require("lodash");
exports.createShare = function (io) {
  return async (req, res) => {
    console.log("createNearByRideShare Route Called");
    try {
      let nearByRideShare = new NearByRideShare(req.body);

      let user = await User.findById(req.body.sharerId);

      if (!user) {
        return res
          .status(200)
          .send({ status: "error", errorCode: 400, message: "Wrong user id" });
      }

      sendGlobalNotification(
        `Nearby Ride Shared - ${req.body.rideName}`,
        `${req.body.seatsAvailable}x seats available, Be the first ${req.body.ownerContactNumber}`
      );

      await nearByRideShare.save();

      //Broadcast Event
      io.emit("nearByRides:newShare", nearByRideShare);

      res.status(200).send({
        status: "success",
        data: nearByRideShare,
        message: "nearByRideShare Successfully Created",
      });
    } catch (err) {
      res
        .status(200)
        .send({ status: "success", errorCode: 500, message: err.message });
    }
  };
};
exports.getUserNearByRideShares = async (req, res) => {
  console.log("getNearByRideShares Route Called");
  // console.log("Socket Id", socketId);
  try {
    let nearByRideShares = await NearByRideShare.find({
      sharerId: { $in: [req.body.sharerId] },
    });
    if (nearByRideShares)
      return res.status(200).send({
        status: "success",
        data: nearByRideShares,
        message: "User's NearByRideShares",
      });

    res.status(200).send({
      status: "success",
      data: [],
      message: "User have not shared any rides in nearby ride shares!",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.getAllNearByRideShares = async (req, res) => {
  console.log("getNearByRideShares Route Called");
  // console.log("Sockkkk");
  // console.log("Global SocketId", socketId);

  try {
    let nearByRideShares = await NearByRideShare.find({
      isAvailable: true,
      sharerId: { $ne: req.body.userId },
    });
    if (!nearByRideShares)
      return res.status(200).send({
        status: "failure",
        data: [],
        message: "No available ride shares",
      });

    res.status(200).send({
      status: "success",
      data: nearByRideShares,
      message: "All nearby ride shares",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.createNearByBooking = function (io) {
  console.log("SocketId in createNearByBooking", socketId);
  return async (req, res) => {
    console.log("createNearByRideShare Booking Route Called");

    try {
      let nearByRideShare = await NearByRideShare.findById(req.params.id);

      if (!nearByRideShare.isAvailable) {
        return res.status(200).send({
          status: "Error",
          errorCode: 400,
          message: "Share is not available.",
        });
      }

      // console.log("getting bookings", nearByRideShare.bookings);

      const newBooking = { ...req.body };

      if (nearByRideShare.seatsAvailable < newBooking.availerSeats) {
        return res.status(200).send({
          status: "Error",
          errorCode: 400,
          message: `Not enough seats ! Only ${nearByRideShare.seatsAvailable} available`,
        });
      }

      const checkBooking = nearByRideShare.bookings.filter((booking) => {
        // console.log(booking.availerId.toString().trim());
        // console.log(newBooking.availerId);
        return (
          booking.availerId.toString().trim() === newBooking.availerId.trim()
        );
      });
      // console.log("check booking array", checkBooking);
      if (checkBooking.length > 0) {
        return res.status(200).send({
          status: "Error",
          errorCode: 400,
          message: "Booking Exists ! Same user cannot avail the share twice.",
        });
      }
      if (nearByRideShare.bookings) {
        nearByRideShare.bookings.unshift(newBooking);
      } else {
        let bookings = [];
        bookings.unshift(newBooking);
        nearByRideShare.bookings = bookings;
      }

      nearByRideShare.save();
      sendIndividualNotification(
        nearByRideShare.sharerId,
        `You have a booking for ${nearByRideShare.rideName}`,
        `${req.body.availerName} has a message: ${req.body.availerMessage}`
      );

      if (socketId) {
        //emit event on socket id to listen for the created booking
        io.to(socketId).emit("nearByRides:newShareBooking", nearByRideShare);
      }

      return res.status(200).send({
        status: "success",
        data: nearByRideShare.bookings,
        message: "New booking created",
      });
    } catch (err) {
      return res
        .status(200)
        .send({ status: "Error", errorCode: 500, message: err.message });
    }
  };
};

exports.acceptNearByBooking = function (io) {
  return async (req, res) => {
    console.log("acceptNearByRideShare Booking Route Called");
    let availerName = "";

    try {
      let nearByRideShare = await NearByRideShare.findById(req.body.shareId);

      if (!nearByRideShare.isAvailable) {
        return res.status(200).send({
          status: "Error",
          errorCode: 400,
          message: "Booking capacity is full.",
        });
      }

      let user = await User.findById(req.body.availerId);

      if (!user) {
        return res.status(200).send({
          status: "error",
          errorCode: 400,
          message: "Wrong availer id",
        });
      }

      let bookings = nearByRideShare.bookings;
      let acceptedBooking = {};

      for (let booking of bookings) {
        if (booking["_id"].toString().trim() === req.body.bookingId.trim()) {
          if (booking.isAccepted) {
            return res.status(200).send({
              status: "Failure",
              errorCode: 400,
              message: "Booking Already Accepted",
            });
          }
          booking.isAccepted = true;
          nearByRideShare.seatsAvailable =
            nearByRideShare.seatsAvailable - booking.availerSeats;

          availerName = booking.availerName;
          acceptedBooking = booking;
        }
      }

      if (nearByRideShare.seatsAvailable === 0) {
        nearByRideShare.isAvailable = false;
      }

      let shareAvailedTemp = _.omit(
        JSON.parse(JSON.stringify(nearByRideShare)),
        ["_id"]
      );
      const availedNearByRideShare = {
        ...shareAvailedTemp,
        shareId: `${nearByRideShare._id}`,
        availerId: req.body.availerId,
      };

      // console.log("Availed Share", availedNearByRideShare);
      let availNearByRideShare = new UserAvailedRides(availedNearByRideShare);

      availNearByRideShare.save();

      nearByRideShare.save();

      sendIndividualNotification(
        req.body.availerId,
        `Booking accepted`,
        `Hi ${availerName}, Your booking for ${nearByRideShare.rideName} is accepted.`
      );

      if (socketId) {
        io.to(socketId).emit(
          "nearByRides:bookingAcceptedAvailer",
          nearByRideShare
        );
        io.to(socketId).emit(
          "nearByRides:bookingAcceptedSharer",
          acceptedBooking
        );
      }

      return res.status(200).send({
        status: "success",
        data: "",
        message: `${availerName}'s booking accepted.`,
      });
    } catch (err) {
      return res
        .status(200)
        .send({ status: "Error", errorCode: 500, message: err.message });
    }
  };
};

module.exports.registerNearByRidesHandlers = (io, socket) => {
  const createNearByRides = (newRide) => {
    io.emit("nearByRides:newShare", {
      newRide,
    });
    console.log("nearByRides:newSharein createNearByRides", newRide);
  };

  const onNearByRidesCreateBooking = (newBooking) => {
    io.to(socket.id).emit("nearByRides:newBooking", {
      newBooking,
    });
    console.log(
      "nearByRides:newBooking in onNearByRidesCreateBooking",
      newBooking
    );
  };

  const onNearByRidesAcceptBooking = (updatedBooking) => {
    io.to(socket.id).emit("nearByRides:acceptBooking", {
      updatedBooking,
    });
    console.log(
      "nearByRides:updatedBooking in onNearByRidesAcceptBooking",
      updatedBooking
    );
  };

  socket.on("nearByRides:newShare", createNearByRides);
  socket.on("nearByRides:newBooking", onNearByRidesCreateBooking);
  socket.on("nearByRides:acceptBooking", onNearByRidesAcceptBooking);
};

exports.deleteShare = async (req, res) => {
  console.log("Delete NearByRide Share route called");
  try {
    NearByRideShare.deleteOne({ _id: req.body.id }, function (err) {
      if (err)
        return res
          .status(200)
          .send({ status: "Error", errorCode: 500, message: err.message });
      UserAvailedRides.deleteMany({ shareId: req.body.id }, function (err) {
        if (err) return handleError(err);
        return res.status(200).send({
          status: "success",
          message: `NearByRide Share Deleted`,
        });
      });
    });
  } catch (err) {
    return res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};
