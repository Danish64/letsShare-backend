const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate, validateEmail } = require("../models/user");
const debug = require("debug")("app:db");

exports.registerUser = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) res.status(400).send("User already exist !");

  user = new User(_.omit(req.body, ["password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();

  res.status(200).header("x-auth-token", token).send(user);
};

// exports.getUsers = async (req, res, next) => {
//   let users = await User.find().sort("name");
//   res.send(users);
// };

exports.getUser = async (req, res) => {
  let user = await User.findById(req.params.id).lean();
  if (!user) {
    return res.status(404).send("Wrong User Id");
  }
  res.status(200).send(_.omit(user, ["password"]));
};

exports.getUserWithEmail = async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send("No user exist with this email.");
  }

  const token = user.generateAuthToken();
  res.status(200).header("x-auth-token", token).send(user);
};
