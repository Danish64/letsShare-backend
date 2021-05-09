const { UserSpaceSchema } = require("../../models/Assets/Space");

exports.createUserSpace = async (req, res) => {
  console.log("createUserSpace Route Called");
  try {
    let userSpace = new UserSpaceSchema(req.body);
    await userSpace.save();

    res.status(200).send({
      status: "success",
      data: userSpace,
      message: "userSpace Successfully Created",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "success", errorCode: 500, message: err.message });
  }
};
exports.getUserSpaces = async (req, res) => {
  console.log("getUserSpaces Route Called");
  try {
    let userSpaces = await UserSpaceSchema.find({
      ownerId: { $in: [req.body.ownerId] },
    });
    if (userSpaces?.length > 0) {
      return res.status(200).send({
        status: "success",
        data: userSpaces,
        message: "User's Spaces",
      });
    }

    if (userSpaces?.length === 0) {
      res.status(200).send({
        status: "success",
        data: [],
        message: "User have no Spaces!",
      });
    }
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};
