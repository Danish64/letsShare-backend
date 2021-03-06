const bcrypt = require("bcrypt");

const _ = require("lodash");
const { User, validate, validateEmail } = require("../models/user");
const debug = require("debug")("app:db");

exports.registerUser = async (req, res) => {
  // console.log("registerUser Route Called");
  try {
    // const { error } = validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(200).send({
        status: "success",
        errorCode: 400,
        message: "User already exist !",
      });

    user = new User(req.body);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();

    res
      .status(200)
      .header("x-auth-token", token)
      .send({ status: "success", data: user, message: null });
  } catch (err) {
    res
      .status(200)
      .send({ status: "success", errorCode: 500, message: err.message });
  }
};

exports.getUsers = async (req, res, next) => {
  // console.log("Get all users called ");
  try {
    let users = await User.find({}).sort("name");
    // console.log(users);
    res.send({ status: "success", data: users, message: null });
  } catch (err) {
    console.log("Error in get all users", err);
  }
};

exports.getUser = async (req, res) => {
  // console.log("Get User Called");
  let user = await User.findById(req.params.id).lean();
  if (!user) {
    return res
      .status(200)
      .send({ status: "success", errorCode: 404, message: "Wrong User Id" });
  }
  res.status(200).send({ status: "success", data: user, message: null });
};

exports.getLoggedInUser = async (req, res) => {
  let user = await User.findById(req.user._id).lean();
  if (!user) {
    return res
      .status(200)
      .send({ status: "success", errorCode: 404, message: "Wrong User Id" });
  }
  res.status(200).send({ status: "success", data: user, message: null });
};

exports.getUserWithEmail = async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error)
    return res.status(200).send({
      status: "success",
      data: null,
      message: error.details[0].message,
    });

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(200).send({
      status: "success",
      data: { userExists: false },
      message: "No User Exist",
    });
  } else {
    return res.status(200).send({
      status: "success",
      data: { userExists: true },
      message: "User Exists",
    });
  }
};

// exports.updateUserEmail = async (req, res) => {
//   const { error } = validateEmail(req.body);
//   if (error)
//     return res
//       .status(200)
//       .send({
//         status: "success",
//         errorCode: 400,
//         message: error.details[0].message,
//       });

//   let user = await User.findOne({ email: req.body.email });
//   if (user)
//     return res
//       .status(200)
//       .send({ status: "success", errorCode: 400, message: "User already exists!" });

//   if (!user) {
//     return res.status(404).send(false);
//   } else {
//     return res.status(200).send(true);
//   }
// };
