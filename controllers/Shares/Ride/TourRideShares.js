const { TourRideShare } = require("../../../models/Shares/Ride/TourRide");
const { User } = require("../../../models/user");
const {
  UserAvailedRides,
} = require("../../../models/Shares/Ride/UserAvailedRides");
var _ = require("lodash");
var { sendGlobalNotification } = require("../../../helpers/Notifications");

exports.createShare = async (req, res) => {
  console.log("createTourRideShare Route Called");
  try {
    let tourRideShare = new TourRideShare(req.body);

    let user = await User.findById(req.body.sharerId);

    if (!user) {
      return res
        .status(200)
        .send({ status: "error", errorCode: 400, message: "Wrong user id" });
    }

    user.sharedAssets.sharedRides.push(tourRideShare);

    sendGlobalNotification(
      `Tour Ride Shared - ${req.body.rideName}`,
      `${req.body.seatsAvailable}x seats available ${"\n"}${
        req.body.startLocation.address
      } to ${req.body.destinationLocation.address} ${"\n"}${
        req.body.tourInfo
      }${"\n"}Be the first ${req.body.ownerContactNumber}`
    );

    await tourRideShare.save();

    res.status(200).send({
      status: "success",
      data: tourRideShare,
      message: "TourRideShare Successfully Created",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "success", errorCode: 500, message: err.message });
  }
};
exports.getUserTourRideShares = async (req, res) => {
  console.log("getTourRideShares Route Called");
  try {
    let tourRideShares = await TourRideShare.find({
      sharerId: { $in: [req.body.sharerId] },
    });
    if (tourRideShares)
      return res.status(200).send({
        status: "success",
        data: tourRideShares,
        message: "User's TourRideShares",
      });

    res.status(200).send({
      status: "success",
      data: [],
      message: "User have not shared any rides in tour ride shares!",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.getAllTourRideShares = async (req, res) => {
  console.log("getAllTourRideShares Route Called");
  try {
    let tourRideShares = await TourRideShare.find({
      isAvailable: true,
      sharerId: { $ne: req.body.userId },
    });
    if (!tourRideShares)
      return res.status(200).send({
        status: "error",
        data: [],
        message: "No available tour ride shares",
      });

    res.status(200).send({
      status: "success",
      data: tourRideShares,
      message: "All tour ride shares",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.createTourRideShareBooking = async (req, res) => {
  console.log("createTourRideShare Booking Route Called");

  try {
    let tourRideShare = await TourRideShare.findById(req.params.id);

    if (!tourRideShare.isAvailable) {
      return res.status(200).send({
        status: "Error",
        errorCode: 400,
        message: "Share is not available.",
      });
    }

    // console.log("getting bookings", TourRideShare.bookings);

    const newBooking = { ...req.body };

    if (tourRideShare.seatsAvailable < newBooking.availerSeats) {
      return res.status(200).send({
        status: "Error",
        errorCode: 400,
        message: `Not enough seats ! Only ${tourRideShare.seatsAvailable} available`,
      });
    }

    const checkBooking = tourRideShare.bookings.filter((booking) => {
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
    if (tourRideShare.bookings) {
      tourRideShare.bookings.unshift(newBooking);
    } else {
      let bookings = [];
      bookings.unshift(newBooking);
      tourRideShare.bookings = bookings;
    }

    tourRideShare.save();
    return res.status(200).send({
      status: "success",
      data: tourRideShare.bookings,
      message: "New booking created",
    });
  } catch (err) {
    return res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.acceptTourRideShareBooking = async (req, res) => {
  console.log("acceptTourRideShare Booking Route Called");
  let availerName = "";

  try {
    let tourRideShare = await TourRideShare.findById(req.body.shareId);

    if (!tourRideShare.isAvailable) {
      return res.status(200).send({
        status: "Error",
        errorCode: 400,
        message: "Booking capacity is full.",
      });
    }

    let user = await User.findById(req.body.availerId);

    if (!user) {
      return res
        .status(200)
        .send({ status: "error", errorCode: 400, message: "Wrong availer id" });
    }
    let bookings = tourRideShare.bookings;

    for (let booking of bookings) {
      if (booking["_id"].toString().trim() === req.body.bookingId.trim()) {
        booking.isAccepted = true;
        tourRideShare.seatsAvailable =
          tourRideShare.seatsAvailable - booking.availerSeats;

        availerName = booking.availerName;
      }
    }

    if (tourRideShare.seatsAvailable === 0) {
      tourRideShare.isAvailable = false;
    }

    // console.log("Updated Share", TourRideShare.seatsAvailable);

    let shareAvailedTemp = _.omit(JSON.parse(JSON.stringify(tourRideShare)), [
      "_id",
    ]);
    const availedRideShareTemp = {
      ...shareAvailedTemp,
      shareId: `${tourRideShare._id}`,
      availerId: req.body.availerId,
    };

    let availedRideShare = new UserAvailedRides(availedRideShareTemp);

    availedRideShare.save();

    tourRideShare.save();

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
