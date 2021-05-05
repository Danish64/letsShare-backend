const { NearByRideShare } = require("../../../models/Shares/Ride/NearByRide");
const { User } = require("../../../models/user");
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

      user.sharedAssets.sharedRides.push(nearByRideShare);

      await user.save();

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
  console.log("called");

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

exports.createNearByBooking = function (io, socketId) {
  // console.log("SocketId in createNearByBooking", socketId);
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

      //emit event on share id to listen for the created booking
      io.to(socketId).emit("nearByRides:newShareBooking", nearByRideShare);

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

exports.acceptNearByBooking = function (io, socketId) {
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

      let bookings = nearByRideShare.bookings;
      let acceptedBooking = {};

      for (let booking of bookings) {
        if (booking["_id"].toString().trim() === req.body.bookingId.trim()) {
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

      let user = await User.findById(req.body.availerId);

      if (!user) {
        return res.status(200).send({
          status: "error",
          errorCode: 400,
          message: "Wrong availer id",
        });
      }

      user.availedAssets.availedRides.push(nearByRideShare);

      await user.save();

      nearByRideShare.save();

      io.to(socketId).emit(
        "nearByRides:bookingAcceptedAvailer",
        nearByRideShare
      );
      io.to(socketId).emit(
        "nearByRides:bookingAcceptedSharer",
        acceptedBooking
      );

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
