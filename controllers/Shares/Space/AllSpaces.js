const {
  ResidenceSpaceShare,
} = require("../../../models/Shares/Space/Residence");

exports.getAllSpaceShares = async (req, res) => {
  console.log("getAllSpaceShares Route Called");

  try {
    let residenceShares = await ResidenceSpaceShare.find({
      isAvailable: true,
      sharerId: { $ne: req.body.sharerId },
    });

    let allSpaces = [...residenceShares];
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
