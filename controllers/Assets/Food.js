const { UserFoodSchema } = require("../../models/Assets/Food");
exports.createUserFood = async (req, res) => {
  console.log("createUserFood Route Called");
  try {
    let userFood = new UserFoodSchema(req.body);
    await userFood.save();

    res.status(200).send({
      status: "success",
      data: userFood,
      message: "userFood Successfully Created",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "success", errorCode: 500, message: err.message });
  }
};
exports.getUserFoods = async (req, res) => {
  console.log("getUserFoods Route Called");
  try {
    let userFoods = await UserFoodSchema.find({
      ownerId: { $in: [req.body.ownerId] },
    });
    if (userFoods)
      return res.status(200).send({
        status: "success",
        data: userFoods,
        message: "User's Foods",
      });

    res.status(200).send({
      status: "success",
      data: [],
      message: "User have no Foods!",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};
