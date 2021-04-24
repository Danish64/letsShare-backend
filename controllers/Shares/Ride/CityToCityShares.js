const {
  CityToCityRideShare,
} = require("../../../models/Shares/Ride/CityToCity");

exports.createShare = async (req, res) => {
  console.log("createCityToCityShare Route Called");
  try {
    let cityToCityRideShare = new CityToCityRideShare(req.body);

    let user = await User.findById(req.body.sharerId);

    if (!user) {
      return res
        .status(200)
        .send({ status: "error", errorCode: 400, message: "Wrong user id" });
    }

    user.sharedAssets.sharedRides.push(cityToCityRideShare);

    await cityToCityRideShare.save();

    res.status(200).send({
      status: "success",
      data: cityToCityRideShare,
      message: "CityToCityRideShare Successfully Created",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "success", errorCode: 500, message: err.message });
  }
};
exports.getUserCityToCityRideShares = async (req, res) => {
  console.log("getCityToCityRideShares Route Called");
  try {
    let cityToCityRideShares = await CityToCityRideShare.find({
      sharerId: { $in: [req.body.sharerId] },
    });
    if (cityToCityRideShares)
      return res.status(200).send({
        status: "success",
        data: cityToCityRideShares,
        message: "User's CityToCityRideShares",
      });

    res.status(200).send({
      status: "success",
      data: [],
      message: "User have not shared any rides in CityToCity ride shares!",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.getAllCityToCityRideShares = async (req, res) => {
  console.log("getAllCityToCityRideShares Route Called");
  try {
    let cityToCityRideShares = await CityToCityRideShare.find({
      isAvailable: true,
      sharerId: { $ne: req.body.userId },
    });
    if (!cityToCityRideShares)
      return res.status(200).send({
        status: "error",
        data: [],
        message: "No available city to city ride shares",
      });

    res.status(200).send({
      status: "success",
      data: cityToCityRideShares,
      message: "All cityToCity ride shares",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.createCityToCityBooking = async (req, res) => {
  console.log("createCityToCityRideShare Booking Route Called");

  try {
    let cityToCityRideShare = await CityToCityRideShare.findById(req.params.id);

    if (!cityToCityRideShare.isAvailable) {
      return res.status(200).send({
        status: "Error",
        errorCode: 400,
        message: "Share is not available.",
      });
    }

    // console.log("getting bookings", cityToCityRideShare.bookings);

    const newBooking = { ...req.body };

    if (cityToCityRideShare.seatsAvailable < newBooking.availerSeats) {
      return res.status(200).send({
        status: "Error",
        errorCode: 400,
        message: `Not enough seats ! Only ${cityToCityRideShare.seatsAvailable} available`,
      });
    }

    const checkBooking = cityToCityRideShare.bookings.filter((booking) => {
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
    if (cityToCityRideShare.bookings) {
      cityToCityRideShare.bookings.unshift(newBooking);
    } else {
      let bookings = [];
      bookings.unshift(newBooking);
      cityToCityRideShare.bookings = bookings;
    }

    cityToCityRideShare.save();

    return res.status(200).send({
      status: "success",
      data: cityToCityRideShare.bookings,
      message: "New booking created",
    });
  } catch (err) {
    return res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.acceptCityToCityBooking = async (req, res) => {
  console.log("acceptCityToCityRideShare Booking Route Called");
  let availerName = "";

  try {
    let cityToCityRideShare = await CityToCityRideShare.findById(
      req.body.shareId
    );

    if (!cityToCityRideShare.isAvailable) {
      return res.status(200).send({
        status: "Error",
        errorCode: 400,
        message: "Booking capacity is full.",
      });
    }

    let bookings = cityToCityRideShare.bookings;

    for (let booking of bookings) {
      if (booking["_id"].toString().trim() === req.body.bookingId.trim()) {
        booking.isAccepted = true;
        cityToCityRideShare.seatsAvailable =
          cityToCityRideShare.seatsAvailable - booking.availerSeats;

        availerName = booking.availerName;
      }
    }

    if (cityToCityRideShare.seatsAvailable === 0) {
      cityToCityRideShare.isAvailable = false;
    }

    // console.log("Updated Share", cityToCityRideShare.seatsAvailable);

    let user = await User.findById(req.body.availerId);

    if (!user) {
      return res
        .status(200)
        .send({ status: "error", errorCode: 400, message: "Wrong availer id" });
    }

    user.availedAssets.availedRides.push(cityToCityRideShare);

    await user.save();

    cityToCityRideShare.save();

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
