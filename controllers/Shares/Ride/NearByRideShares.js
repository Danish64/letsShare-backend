const { NearByRideShare } = require("../../../models/Shares/Ride/NearByRide");

exports.createShare = async (req, res) => {
  console.log("createNearByRideShare Route Called");
  try {
    nearByRideShare = new NearByRideShare(req.body);
    await nearByRideShare.save();

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
