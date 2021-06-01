const { FoodShare } = require("../../../models/Shares/Food");
const { User } = require("../../../models/user");
var _ = require("lodash");
const {
  UserAvailedFoods,
} = require("../../../models/Shares/Food/userAvailedFoods");
var { sendGlobalNotification } = require("../../../helpers/Notifications");

exports.createShare = async (req, res) => {
  console.log("createFoodShare Route Called");
  try {
    let foodShare = new FoodShare(req.body);
    let user = await User.findById(req.body.sharerId);

    if (!user) {
      return res
        .status(200)
        .send({ status: "error", errorCode: 400, message: "Wrong user id" });
    }

    user.sharedAssets.sharedFoods.push(foodShare);

    sendGlobalNotification(
      `Food Shared - ${req.body.title}`,
      `${req.body.quantity}x available, Be the first ${req.body.ownerContactNumber}`
    );

    await user.save();

    await foodShare.save();

    res.status(200).send({
      status: "success",
      data: foodShare,
      message: "foodShare Successfully Created",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "success", errorCode: 500, message: err.message });
  }
};
exports.getUserFoodShares = async (req, res) => {
  console.log("getFoodShares Route Called");
  try {
    let foodShares = await FoodShare.find({
      sharerId: { $in: [req.body.sharerId] },
    });
    if (foodShares)
      return res.status(200).send({
        status: "success",
        data: foodShares,
        message: "User's FoodShares",
      });

    return res.status(200).send({
      status: "success",
      data: [],
      message: "User have not shared any foods!",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.getAllFoodShares = async (req, res) => {
  console.log("getFoodShares Route Called");
  try {
    let foodShares = await FoodShare.find({
      isAvailable: true,
      sharerId: { $ne: req.body.userId },
    });
    if (!foodShares)
      return res.status(200).send({
        status: "failure",
        data: [],
        message: "No available food shares",
      });

    res.status(200).send({
      status: "success",
      data: foodShares,
      message: "All food shares",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.createFoodShareBooking = async (req, res) => {
  console.log("createFoodShare Booking Route Called");

  try {
    let foodShare = await FoodShare.findById(req.params.id);

    if (!foodShare.isAvailable) {
      return res.status(200).send({
        status: "Error",
        errorCode: 400,
        message: "Share is not available.",
      });
    }

    const newBooking = { ...req.body };

    if (foodShare.quantity < newBooking.availerQuantity) {
      return res.status(200).send({
        status: "Error",
        errorCode: 400,
        message: `Not enough quantity ! Only ${foodShare.quantity} available`,
      });
    }

    const checkBooking = foodShare.bookings.filter((booking) => {
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
    if (foodShare.bookings) {
      foodShare.bookings.unshift(newBooking);
    } else {
      let bookings = [];
      bookings.unshift(newBooking);
      goodShare.bookings = bookings;
    }

    foodShare.save();

    return res.status(200).send({
      status: "success",
      data: foodShare.bookings,
      message: "New booking created",
    });
  } catch (err) {
    return res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.acceptFoodShareBooking = async (req, res) => {
  console.log("acceptFoodShare Booking Route Called");
  let availerName = "";

  try {
    let foodShare = await FoodShare.findById(req.body.shareId);
    // console.log("Good Share ", goodShare);

    let user = await User.findById(req.body.availerId);

    if (!user) {
      return res
        .status(200)
        .send({ status: "error", errorCode: 400, message: "Wrong availer id" });
    }

    if (!foodShare.isAvailable) {
      return res.status(200).send({
        status: "Error",
        errorCode: 400,
        message: "Not available ! Must be availed fully",
      });
    }

    let bookings = foodShare.bookings;

    for (let booking of bookings) {
      if (booking["_id"].toString().trim() === req.body.bookingId.trim()) {
        booking.isAccepted = true;
        foodShare.quantity = foodShare.quantity - booking.availerQuantity;
        availerName = booking.availerName;
      }
    }

    if (foodShare.quantity === 0) {
      foodShare.isAvailable = false;
    }

    let shareAvailedTemp = _.omit(JSON.parse(JSON.stringify(foodShare)), [
      "_id",
    ]);
    const availedFoodShare = {
      ...shareAvailedTemp,
      shareId: `${foodShare._id}`,
      availerId: req.body.availerId,
    };

    let availFoodShare = new UserAvailedFoods(availedFoodShare);

    availFoodShare.save();

    await foodShare.save();

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

exports.getUserAvailedFoods = async (req, res) => {
  console.log("getUserAvailedFoods Route Called");

  const activeFilter = {
    availerId: { $in: [req.body.availerId] },
    isCompleted: false,
  };
  const filter = req.body.active
    ? activeFilter
    : { availerId: { $in: [req.body.availerId] } };

  // console.log("Filter", filter);

  try {
    let userAvailedFoods = await UserAvailedFoods.find(filter);

    if (userAvailedFoods.length > 0)
      return res.status(200).send({
        status: "success",
        data: userAvailedFoods,
        message: "User's Availed Foods",
      });

    res.status(200).send({
      status: "success",
      data: [],
      message: "User have not availed any foods!",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};
