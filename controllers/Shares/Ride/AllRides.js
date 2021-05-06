const { NearByRideShare } = require("../../../models/Shares/Ride/NearByRide");
const {
  CityToCityRideShare,
} = require("../../../models/Shares/Ride/CityToCity");
const { TourRideShare } = require("../../../models/Shares/Ride/TourRide");

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
