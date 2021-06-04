const {
  WorkingSpaceShare,
} = require("../../../models/Shares/Space/CoworkingSpace");
const {
  UserAvailedSpaces,
} = require("../../../models/Shares/Space/UserAvailedSpaces");
const { User } = require("../../../models/user");
var _ = require("lodash");
var {
  sendGlobalNotification,
  sendIndividualNotification,
} = require("../../../helpers/Notifications");

exports.createShare = async (req, res) => {
  console.log("createWorkingSpaceShare Route Called");
  try {
    let workingSpaceShare = new WorkingSpaceShare(req.body);

    let user = await User.findById(req.body.sharerId);

    if (!user) {
      return res
        .status(200)
        .send({ status: "error", errorCode: 400, message: "Wrong user id" });
    }

    await workingSpaceShare.save();
    sendGlobalNotification(
      `Working Space Shared - ${req.body.spaceTitle}`,
      `${req.body.spaceLocation.address} ${"\n"}Be the first ${
        req.body.ownerContactNumber
      }`
    );

    res.status(200).send({
      status: "success",
      data: workingSpaceShare,
      message: "WorkingSpaceShare Successfully Created",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "error", errorCode: 500, message: err.message });
  }
};
exports.getUserWorkingSpaceShares = async (req, res) => {
  console.log("getWorkingSpaceShares Route Called");
  try {
    let workingSpaceShares = await WorkingSpaceShare.find({
      sharerId: { $in: [req.body.sharerId] },
    });
    // console.log("Residence Space Shares", residenceSpaceShares);
    if (workingSpaceShares.length > 0)
      return res.status(200).send({
        status: "success",
        data: workingSpaceShares,
        message: "User's Working Space Shares",
      });

    res.status(200).send({
      status: "success",
      data: [],
      message: "User have not shared any rides in Working Space shares!",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.getAllWorkingSpaceShares = async (req, res) => {
  console.log("getAllWorkingSpaceShares Route Called");
  try {
    let workingSpaceShares = await WorkingSpaceShare.find({
      isAvailable: true,
      sharerId: { $ne: req.body.userId },
    });
    if (!workingSpaceShares)
      return res.status(200).send({
        status: "error",
        data: [],
        message: "No available working space shares",
      });

    res.status(200).send({
      status: "success",
      data: workingSpaceShares,
      message: "All working space shares",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.createWorkingSpaceBooking = async (req, res) => {
  console.log("createWorkingSpaceShare Booking Route Called");

  try {
    let workingSpaceShare = await WorkingSpaceShare.findById(req.params.id);

    if (!workingSpaceShare.isAvailable) {
      return res.status(200).send({
        status: "Error",
        errorCode: 400,
        message: "Share is not available.",
      });
    }

    const newBooking = { ...req.body };

    const checkBooking = workingSpaceShare.bookings.filter((booking) => {
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

    if (workingSpaceShare.seatsAvailable < newBooking.availerSeats) {
      return res.status(200).send({
        status: "Error",
        errorCode: 400,
        message: `Not enough seats ! Only ${workingSpaceShare.seatsAvailable} available`,
      });
    }

    if (workingSpaceShare.desksAvailable < newBooking.availerDesks) {
      return res.status(200).send({
        status: "Error",
        errorCode: 400,
        message: `Not enough desks ! Only ${workingSpaceShare.desksAvailable} available`,
      });
    }

    if (workingSpaceShare.roomsAvailable < newBooking.availerRooms) {
      return res.status(200).send({
        status: "Error",
        errorCode: 400,
        message: `Not enough rooms in office ! Only ${workingSpaceShare.roomsAvailable} available`,
      });
    }

    if (workingSpaceShare.bookings) {
      workingSpaceShare.bookings.unshift(newBooking);
    } else {
      let bookings = [];
      bookings.unshift(newBooking);
      workingSpaceShare.bookings = bookings;
    }

    let shareAvailedTemp = _.omit(
      JSON.parse(JSON.stringify(workingSpaceShare)),
      ["_id"]
    );

    let tempAvailerIds = [req.body.availerId];
    let availWorkingSpace;
    availWorkingSpace = await UserAvailedSpaces.findOne({
      shareId: workingSpaceShare._id,
    });

    if (availWorkingSpace) {
      //   console.log("I exist");
      availWorkingSpace.availerIds.push(req.body.availerId);
      availWorkingSpace.bookings = workingSpaceShare.bookings;
    } else {
      const availedWorkingShare = {
        ...shareAvailedTemp,
        shareId: `${workingSpaceShare._id}`,
        availerIds: tempAvailerIds,
      };
      availWorkingSpace = new UserAvailedSpaces(availedWorkingShare);
    }

    availWorkingSpace.save();
    workingSpaceShare.save();

    sendIndividualNotification(
      workingSpaceShare.sharerId,
      `You have a booking for ${workingSpaceShare.spaceTitle}`,
      `${req.body.availerName} has a message: ${req.body.availerMessage}`
    );

    return res.status(200).send({
      status: "success",
      data: workingSpaceShare.bookings,
      message: "New booking created",
    });
  } catch (err) {
    return res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.acceptWorkingShareBooking = async (req, res) => {
  console.log("acceptWorkingSpaceShare Booking Route Called");
  let availerName = "";

  try {
    let workingSpacesShare = await WorkingSpaceShare.findById(req.body.shareId);

    let availedSpaceShare = await UserAvailedSpaces.findOne({
      shareId: req.body.shareId,
      availerIds: req.body.availerId,
    });

    // console.log("Here this is me", availedSpaceShare.spaceTitle);

    if (!workingSpacesShare.isAvailable) {
      return res.status(200).send({
        status: "Error",
        errorCode: 400,
        message: "Booking capacity is full.",
      });
    }

    //Changes in share's booking

    let bookings = workingSpacesShare.bookings;

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
        booking.bookingStatus = "Accepted";
        if (booking.availerRooms && booking.availerRooms > 0) {
          workingSpacesShare.roomsAvailable =
            workingSpacesShare.roomsAvailable - booking.availerRooms;
        } else if (booking.availerSeats && booking.availerSeats > 0) {
          workingSpacesShare.seatsAvailable =
            workingSpacesShare.seatsAvailable - booking.availerSeats;
        } else if (booking.availerDesks && booking.availerDesks > 0) {
          workingSpacesShare.desksAvailable =
            workingSpacesShare.desksAvailable - booking.availerDesks;
        }
        availerName = booking.availerName;
      }
    }

    //changes in userAvailedSpaces booking

    let availedSpacesBookings = availedSpaceShare.bookings;

    for (let booking of availedSpacesBookings) {
      if (booking["_id"].toString().trim() === req.body.bookingId.trim()) {
        booking.isAccepted = true;
        booking.bookingStatus = "Accepted";
        if (booking.availerRooms && booking.availerRooms > 0) {
          availedSpaceShare.roomsAvailable =
            availedSpaceShare.roomsAvailable - booking.availerRooms;
        } else if (booking.availerSeats && booking.availerSeats > 0) {
          availedSpaceShare.seatsAvailable =
            availedSpaceShare.seatsAvailable - booking.availerSeats;
        } else if (booking.availerDesks && booking.availerDesks > 0) {
          availedSpaceShare.desksAvailable =
            availedSpaceShare.desksAvailable - booking.availerDesks;
        }
      }
    }

    if (
      workingSpacesShare.availableSeats +
        workingSpacesShare.availableRooms +
        workingSpacesShare.availableDesks ===
      0
    ) {
      workingSpacesShare.isAvailable = false;
      availedSpaceShare.isAvailable = false;
    }
    availedSpaceShare.save();
    workingSpacesShare.save();

    sendIndividualNotification(
      req.body.availerId,
      `Booking accepted`,
      `Hi ${availerName}, Your booking for ${workingSpacesShare.spaceTitle} is accepted.`
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

exports.rejectWorkingShareBooking = async (req, res) => {
  console.log("rejectWorkingSpaceShare Booking Route Called");
  let availerName = "";

  try {
    let workingSpacesShare = await WorkingSpaceShare.findById(req.body.shareId);

    let availedSpaceShare = await UserAvailedSpaces.findOne({
      shareId: req.body.shareId,
      availerIds: req.body.availerId,
    });

    if (!workingSpacesShare.isAvailable) {
      return res.status(200).send({
        status: "Error",
        errorCode: 400,
        message: "Booking capacity is full.",
      });
    }

    if (!availedSpaceShare) {
      return res.status(200).send({
        status: "Error",
        errorCode: 400,
        message: "Something is wrong",
      });
    }

    //Changes in share's booking

    let bookings = workingSpacesShare.bookings;

    for (let booking of bookings) {
      //   console.log("Booking", booking);
      if (booking["_id"].toString().trim() === req.body.bookingId.trim()) {
        console.log("Yo! changing working space booking", booking.availerName);

        if (booking.isAccepted) {
          return res.status(200).send({
            status: "Error",
            errorCode: 400,
            message: "Booking already accepted",
          });
        }
        booking.isAccepted = false;
        booking.bookingStatus = "Rejected";
        availerName = booking.availerName;
      }
    }

    //changes in userAvailedSpaces booking

    let availedSpacesBookings = availedSpaceShare.bookings;

    for (let booking of availedSpacesBookings) {
      if (booking["_id"].toString().trim() === req.body.bookingId.trim()) {
        // console.log("Yo! changing availed space booking");
        booking.isAccepted = false;
        booking.bookingStatus = "Rejected";
      }
    }
    await availedSpaceShare.save();
    await workingSpacesShare.save();

    sendIndividualNotification(
      req.body.availerId,
      `Booking rejected`,
      `Hi ${availerName}, Your booking for ${workingSpacesShare.spaceTitle} is rejected.`
    );

    return res.status(200).send({
      status: "success",
      data: "",
      message: `${availerName}'s booking rejected.`,
    });
  } catch (err) {
    return res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.deleteShare = async (req, res) => {
  console.log("Delete working Share route called");

  try {
    WorkingSpaceShare.deleteOne({ _id: req.body.id }, function (err) {
      if (err)
        return res
          .status(200)
          .send({ status: "Error", errorCode: 500, message: err.message });
      UserAvailedSpaces.deleteOne({ shareId: req.body.id }, function (err) {
        if (err) return handleError(err);
        return res.status(200).send({
          status: "success",
          message: `Working Space Share Deleted`,
        });
      });
    });
  } catch (err) {
    return res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};
