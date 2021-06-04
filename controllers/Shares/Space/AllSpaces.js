const {
  ResidenceSpaceShare,
} = require("../../../models/Shares/Space/Residence");
const {
  WorkingSpaceShare,
} = require("../../../models/Shares/Space/CoworkingSpace");

const {
  UserAvailedSpaces,
} = require("../../../models/Shares/Space/UserAvailedSpaces");
exports.getAllSpaceShares = async (req, res) => {
  console.log("getAllSpaceShares Route Called");

  try {
    let residenceShares = await ResidenceSpaceShare.find({
      isAvailable: true,
      sharerId: { $ne: req.body.sharerId },
    });
    let workingShares = await WorkingSpaceShare.find({
      isAvailable: true,
      sharerId: { $ne: req.body.sharerId },
    });

    let allSpaces = [...residenceShares, ...workingShares];
    if (allSpaces.length > 0)
      return res.status(200).send({
        status: "success",
        data: allSpaces,
        message: "All Spaces",
      });

    res.status(200).send({
      status: "success",
      data: [],
      message: "No spaces !",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.getUserSpaceShares = async (req, res) => {
  console.log("getUserSpaceShares Route Called");

  try {
    let residenceShares = await ResidenceSpaceShare.find({
      sharerId: { $in: [req.body.sharerId] },
    });
    let workingShares = await WorkingSpaceShare.find({
      sharerId: { $in: [req.body.sharerId] },
    });

    let allSpaces = [...residenceShares, ...workingShares];
    if (allSpaces.length > 0)
      return res.status(200).send({
        status: "success",
        data: allSpaces,
        message: "User Shared Spaces",
      });

    res.status(200).send({
      status: "success",
      data: [],
      message: "No spaces !",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};

exports.getUserAvailedSpaces = async (req, res) => {
  console.log("getUserAvailedSpaces Route Called");

  const activeFilter = {
    availerIds: req.body.availerId,
    isCompleted: false,
  };
  const filter = req.body.active
    ? activeFilter
    : { availerIds: req.body.availerId };

  // console.log("Filter", filter);

  try {
    let userAvailedSpaces = await UserAvailedSpaces.find(filter);

    if (userAvailedSpaces.length > 0)
      return res.status(200).send({
        status: "success",
        data: userAvailedSpaces,
        message: "User's Availed Spaces",
      });

    res.status(200).send({
      status: "success",
      data: [],
      message: "User have not availed any spaces!",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};
