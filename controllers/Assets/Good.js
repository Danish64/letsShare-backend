const { UserGoodSchema } = require("../../models/Assets/Good");

exports.createUserGood = async (req, res) => {
  console.log("createUserGood Route Called");
  try {
    let userGood = new UserGoodSchema(req.body);
    await userGood.save();

    res.status(200).send({
      status: "success",
      data: userGood,
      message: "userGood Successfully Created",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "success", errorCode: 500, message: err.message });
  }
};
exports.getUserGoods = async (req, res) => {
  console.log("getUserGoods Route Called");
  try {
    let userGoods = await UserGoodSchema.find({
      ownerId: { $in: [req.body.ownerId] },
    });
    if (userGoods)
      return res.status(200).send({
        status: "success",
        data: userGoods,
        message: "User's Goods",
      });

    res.status(200).send({
      status: "success",
      data: [],
      message: "User have no Goods!",
    });
  } catch (err) {
    res
      .status(200)
      .send({ status: "Error", errorCode: 500, message: err.message });
  }
};
