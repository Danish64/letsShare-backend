const { UserRideSchema } = require("../../models/Assets/Ride");

exports.createUserRide = async (req, res) => {
  console.log("createUserRide Route Called");
  try {
    let userRide = new UserRideSchema(req.body);
    await userRide.save();

    res.status(200).send({
      status: "success",
      data: userRide,
      message: "userRide Successfully Created",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "success", errorCode: 500, message: err.message });
  }
};
exports.getUserRides = async (req, res) => {
  console.log("getUserRides Route Called");
  try {
    let userRides = await UserRideSchema.find({
      ownerId: { $in: [req.body.ownerId] },
    });
    if (userRides)
      return res.status(200).send({
        status: "success",
        data: userRides,
        message: "User's Rides",
      });

    res.status(200).send({
      status: "success",
      data: [],
      message: "User have no Rides!",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};
