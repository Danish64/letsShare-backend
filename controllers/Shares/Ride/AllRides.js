const { NearByRideShare } = require("../../../models/Shares/Ride/NearByRide");
const {
  CityToCityRideShare,
} = require("../../../models/Shares/Ride/CityToCity");
const { TourRideShare } = require("../../../models/Shares/Ride/TourRide");

const {
  UserAvailedRides,
} = require("../../../models/Shares/Ride/UserAvailedRides");

exports.getUserRidesShares = async (req, res) => {
  console.log("getUserRideShares Route Called");

  try {
    let nearByRideShares = await NearByRideShare.find({
      sharerId: { $in: [req.body.sharerId] },
    });
    let cityToCityRideShares = await CityToCityRideShare.find({
      sharerId: { $in: [req.body.sharerId] },
    });
    let tourRideShares = await TourRideShare.find({
      sharerId: { $in: [req.body.sharerId] },
    });

    let allRides = [
      ...nearByRideShares,
      ...cityToCityRideShares,
      ...tourRideShares,
    ];
    if (allRides.length > 0)
      return res.status(200).send({
        status: "success",
        data: allRides,
        message: "User's NearByRideShares",
      });

    res.status(200).send({
      status: "success",
      data: [],
      message: "User have not shared any rides!",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.getAllRideShares = async (req, res) => {
  console.log("getAllRideShares Route Called");

  try {
    let nearByRideShares = await NearByRideShare.find({
      isAvailable: true,
      sharerId: { $ne: req.body.sharerId },
    });
    let cityToCityRideShares = await CityToCityRideShare.find({
      isAvailable: true,
      sharerId: { $ne: req.body.sharerId },
    });
    let tourRideShares = await TourRideShare.find({
      isAvailable: true,
      sharerId: { $ne: req.body.sharerId },
    });

    let allRides = [
      ...nearByRideShares,
      ...cityToCityRideShares,
      ...tourRideShares,
    ];
    if (allRides.length > 0)
      return res.status(200).send({
        status: "success",
        data: allRides,
        message: "All Rides",
      });

    res.status(200).send({
      status: "success",
      data: [],
      message: "No rides!",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.getUserAvailedRides = async (req, res) => {
  console.log("getUserAvailedRides Route Called");

  const activeFilter = {
    availerId: { $in: [req.body.availerId] },
    isCompleted: false,
  };
  const filter = req.body.active
    ? activeFilter
    : { availerId: { $in: [req.body.availerId] } };

  console.log("Filter", filter);

  try {
    let userAvailedRides = await UserAvailedRides.find(filter);

    if (userAvailedRides.length > 0)
      return res.status(200).send({
        status: "success",
        data: userAvailedRides,
        message: "User's Availed Rides",
      });

    res.status(200).send({
      status: "success",
      data: [],
      message: "User have not availed any rides!",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};
