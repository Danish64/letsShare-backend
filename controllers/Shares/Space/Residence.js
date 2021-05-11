const {
  ResidenceSpaceShare,
} = require("../../../models/Shares/Space/Residence");
const { User } = require("../../../models/user");

exports.createShare = async (req, res) => {
  console.log("createResidenceSpaceShare Route Called");
  try {
    let residenceSpaceShare = new ResidenceSpaceShare(req.body);

    let user = await User.findById(req.body.sharerId);

    if (!user) {
      return res
        .status(200)
        .send({ status: "error", errorCode: 400, message: "Wrong user id" });
    }

    await user.save();
    await residenceSpaceShare.save();

    res.status(200).send({
      status: "success",
      data: residenceSpaceShare,
      message: "ResidenceSpaceShare Successfully Created",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "error", errorCode: 500, message: err.message });
  }
};
exports.getUserResidenceSpaceShares = async (req, res) => {
  console.log("getResidenceSpaceShares Route Called");
  try {
    let residenceSpaceShares = await ResidenceSpaceShare.find({
      sharerId: { $in: [req.body.sharerId] },
    });
    // console.log("Residence Space Shares", residenceSpaceShares);
    if (residenceSpaceShares.length > 0)
      return res.status(200).send({
        status: "success",
        data: residenceSpaceShares,
        message: "User's Residence Space Shares",
      });

    res.status(200).send({
      status: "success",
      data: [],
      message: "User have not shared any rides in Residence Space shares!",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.getAllResidenceSpaceShares = async (req, res) => {
  console.log("getAllResidenceSpaceShares Route Called");
  try {
    let residenceSpaceShares = await ResidenceSpaceShare.find({
      isAvailable: true,
      sharerId: { $ne: req.body.userId },
    });
    if (!residenceSpaceShares)
      return res.status(200).send({
        status: "error",
        data: [],
        message: "No available residence space shares",
      });

    res.status(200).send({
      status: "success",
      data: residenceSpaceShares,
      message: "All residence space shares",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.createResidenceSpaceBooking = async (req, res) => {
  console.log("createResidenceSpaceShare Booking Route Called");

  try {
    let residenceSpaceShare = await ResidenceSpaceShare.findById(req.params.id);

    if (!residenceSpaceShare.isAvailable) {
      return res.status(200).send({
        status: "Error",
        errorCode: 400,
        message: "Share is not available.",
      });
    }

    // console.log("getting bookings", cityToCityRideShare.bookings);

    const newBooking = { ...req.body };

    const checkBooking = residenceSpaceShare.bookings.filter((booking) => {
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

    if (residenceSpaceShare.singleShareAbleUnit === "room") {
      if (residenceSpaceShare.roomsAvailable < newBooking.availerRooms) {
        return res.status(200).send({
          status: "Error",
          errorCode: 400,
          message: `Not enough seats ! Only ${residenceSpaceShare.roomsAvailable} available`,
        });
      }
    } else if (residenceSpaceShare.singleShareAbleUnit === "bed") {
      if (residenceSpaceShare.bedsAvailable < newBooking.availerBeds) {
        return res.status(200).send({
          status: "Error",
          errorCode: 400,
          message: `Not enough seats ! Only ${residenceSpaceShare.bedsAvailable} available`,
        });
      }
    }

    if (residenceSpaceShare.bookings) {
      residenceSpaceShare.bookings.unshift(newBooking);
    } else {
      let bookings = [];
      bookings.unshift(newBooking);
      residenceSpaceShare.bookings = bookings;
    }

    residenceSpaceShare.save();

    return res.status(200).send({
      status: "success",
      data: residenceSpaceShare.bookings,
      message: "New booking created",
    });
  } catch (err) {
    return res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.acceptResidenceShareBooking = async (req, res) => {
  console.log("acceptResidenceSpaceShare Booking Route Called");
  let availerName = "";

  try {
    let residenceSpacesShare = await ResidenceSpaceShare.findById(
      req.body.shareId
    );

    if (!residenceSpacesShare.isAvailable) {
      return res.status(200).send({
        status: "Error",
        errorCode: 400,
        message: "Booking capacity is full.",
      });
    }

    let bookings = residenceSpacesShare.bookings;

    for (let booking of bookings) {
      if (booking["_id"].toString().trim() === req.body.bookingId.trim()) {
        if (booking.isAccepted) {
          return res.status(200).send({
            status: "Error",
            errorCode: 400,
            message: "Booking already accepted",
          });
        }
        booking.isAccepted = true;
        if (booking.availerRooms) {
          residenceSpacesShare.roomsAvailable =
            residenceSpacesShare.roomsAvailable - booking.availerRooms;
        } else if (booking.availerBeds) {
          residenceSpacesShare.bedsAvailable =
            residenceSpacesShare.bedsAvailable - booking.availerBeds;
        } else if (booking.isAvailingWhole) {
          residenceSpacesShare.isAvailable = false;
        }

        availerName = booking.availerName;
      }
    }

    if (
      residenceSpacesShare.roomsAvailable === 0 ||
      residenceSpacesShare.bedsAvailable === 0
    ) {
      residenceSpacesShare.isAvailable = false;
    }

    // console.log("Updated Share", cityToCityRideShare.seatsAvailable);

    let user = await User.findById(req.body.availerId);

    if (!user) {
      return res
        .status(200)
        .send({ status: "error", errorCode: 400, message: "Wrong availer id" });
    }

    console.log(residenceSpacesShare);
    // user.availedAssets.availedSpaces.push(residenceSpacesShare);

    // await user.save();

    // residenceSpacesShare.save();

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
