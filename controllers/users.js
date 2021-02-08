const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const debug = require("debug")("app:db");

exports.registerUser = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) res.status(400).send("User already exist !");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  //   const token = user.generateAuthToken();

  res.status(200).send(_.pick(user, ["name", "email", "_id"]));
};

exports.getUser = async (req, res) => {
  // const { error } = validate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.params.id);

  res.status(200).send(_.pick(user, ["name", "email", "password"]));
};
