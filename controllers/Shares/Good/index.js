const { GoodShare } = require("../../../models/Shares/Good");
const { User } = require("../../../models/user");
const {
  UserAvailedGoods,
} = require("../../../models/Shares/Good/userAvailedGoods");
var _ = require("lodash");
var {
  sendGlobalNotification,
  sendIndividualNotification,
} = require("../../../helpers/Notifications");

exports.createShare = async (req, res) => {
  console.log("createGoodShare Route Called");
  try {
    let goodShare = new GoodShare(req.body);

    let user = await User.findById(req.body.sharerId);

    if (!user) {
      return res
        .status(200)
        .send({ status: "error", errorCode: 400, message: "Wrong user id" });
    }

    user.sharedAssets.sharedGoods.push(goodShare);

    sendGlobalNotification(
      `Goods Shared - ${req.body.title}`,
      `${req.body.quantity}x available, Be the first ${req.body.ownerContactNumber}`
    );

    await user.save();

    await goodShare.save();

    res.status(200).send({
      status: "success",
      data: goodShare,
      message: "goodShare Successfully Created",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "success", errorCode: 500, message: err.message });
  }
};
exports.getUserGoodShares = async (req, res) => {
  console.log("getGoodShares Route Called");
  try {
    let goodShares = await GoodShare.find({
      sharerId: { $in: [req.body.sharerId] },
    });
    if (goodShares)
      return res.status(200).send({
        status: "success",
        data: goodShares,
        message: "User's GoodShares",
      });

    return res.status(200).send({
      status: "success",
      data: [],
      message: "User have not shared any goods!",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.getAllGoodShares = async (req, res) => {
  console.log("getGoodShares Route Called");
  try {
    let goodShares = await GoodShare.find({
      isAvailable: true,
      sharerId: { $ne: req.body.userId },
    });
    if (!goodShares)
      return res.status(200).send({
        status: "failure",
        data: [],
        message: "No available good shares",
      });

    res.status(200).send({
      status: "success",
      data: goodShares,
      message: "All good shares",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.createGoodShareBooking = async (req, res) => {
  console.log("createGoodShare Booking Route Called");

  try {
    let goodShare = await GoodShare.findById(req.params.id);

    if (!goodShare.isAvailable) {
      return res.status(200).send({
        status: "Error",
        errorCode: 400,
        message: "Share is not available.",
      });
    }

    const newBooking = { ...req.body };

    if (goodShare.quantity < newBooking.availerQuantity) {
      return res.status(200).send({
        status: "Error",
        errorCode: 400,
        message: `Not enough quantity ! Only ${goodShare.quantity} available`,
      });
    }

    const checkBooking = goodShare.bookings.filter((booking) => {
      return (
        booking.availerId.toString().trim() === newBooking.availerId.trim()
      );
    });

    if (checkBooking.length > 0) {
      return res.status(200).send({
        status: "Error",
        errorCode: 400,
        message: "Booking Exists ! Same user cannot avail the share twice.",
      });
    }
    if (goodShare.bookings) {
      goodShare.bookings.unshift(newBooking);
    } else {
      let bookings = [];
      bookings.unshift(newBooking);
      goodShare.bookings = bookings;
    }

    goodShare.save();

    sendIndividualNotification(
      goodShare.sharerId,
      `You have a booking for ${goodShare.title}`,
      `${req.body.availerName} has a message: ${req.body.availerMessage}`
    );

    return res.status(200).send({
      status: "success",
      data: goodShare.bookings,
      message: "New booking created",
    });
  } catch (err) {
    return res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.acceptGoodShareBooking = async (req, res) => {
  console.log("acceptGoodShare Booking Route Called");
  let availerName = "";

  try {
    let goodShare = await GoodShare.findById(req.body.shareId);
    // console.log("Good Share ", goodShare);

    let user = await User.findById(req.body.availerId);

    if (!user) {
      return res
        .status(200)
        .send({ status: "error", errorCode: 400, message: "Wrong availer id" });
    }

    if (!goodShare.isAvailable) {
      return res.status(200).send({
        status: "Error",
        errorCode: 400,
        message: "Not available ! Must be availed fully",
      });
    }

    let bookings = goodShare.bookings;

    for (let booking of bookings) {
      if (booking["_id"].toString().trim() === req.body.bookingId.trim()) {
        booking.isAccepted = true;
        goodShare.quantity = goodShare.quantity - booking.availerQuantity;

        availerName = booking.availerName;
      }
    }

    if (goodShare.quantity === 0) {
      goodShare.isAvailable = false;
    }

    let shareAvailedTemp = _.omit(JSON.parse(JSON.stringify(goodShare)), [
      "_id",
    ]);
    const availedGoodShare = {
      ...shareAvailedTemp,
      shareId: `${goodShare._id}`,
      availerId: req.body.availerId,
    };

    let availGoodShare = new UserAvailedGoods(availedGoodShare);

    availGoodShare.save();

    await goodShare.save();

    sendIndividualNotification(
      req.body.availerId,
      `Booking accepted`,
      `Hi ${availerName}, Your booking for ${goodShare.title} is accepted.`
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

exports.getUserAvailedGoods = async (req, res) => {
  console.log("getUserAvailedGoods Route Called");

  const activeFilter = {
    availerId: { $in: [req.body.availerId] },
    isCompleted: false,
  };
  const filter = req.body.active
    ? activeFilter
    : { availerId: { $in: [req.body.availerId] } };

  // console.log("Filter", filter);

  try {
    let userAvailedGoods = await UserAvailedGoods.find(filter);

    if (userAvailedGoods.length > 0)
      return res.status(200).send({
        status: "success",
        data: userAvailedGoods,
        message: "User's Availed Goods",
      });

    res.status(200).send({
      status: "success",
      data: [],
      message: "User have not availed any goods!",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.deleteShare = async (req, res) => {
  console.log("Delete Good Share route called");
  try {
    GoodShare.deleteOne({ _id: req.body.id }, function (err) {
      if (err)
        return res
          .status(200)
          .send({ status: "Error", errorCode: 500, message: err.message });
      UserAvailedGoods.deleteOne({ shareId: req.body.id }, function (err) {
        if (err) return handleError(err);
        return res.status(200).send({
          status: "success",
          message: `Good Share Deleted`,
        });
      });
    });
  } catch (err) {
    return res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};
