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
    if (user) return res.status(400).send("User already exist !");

    user = new User(req.body);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();

    res.status(200).header("x-auth-token", token).send(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// exports.getUsers = async (req, res, next) => {
//   let users = await User.find().sort("name");
//   res.send(users);
// };

exports.getUser = async (req, res) => {
  // console.log("Get User Called");
  let user = await User.findById(req.params.id).lean();
  if (!user) {
    return res.status(404).send("Wrong User Id");
  }
  res.status(200).send(user);
};

exports.getLoggedInUser = async (req, res) => {
  let user = await User.findById(req.user._id).lean();
  if (!user) {
    return res.status(404).send("Wrong User Id");
  }
  res.status(200).send(user);
};

exports.getUserWithEmail = async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send(false);
  } else {
    return res.status(200).send(true);
  }
};

exports.updateUserEmail = async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already exist !");

  if (!user) {
    return res.status(404).send(false);
  } else {
    return res.status(200).send(true);
  }
};
