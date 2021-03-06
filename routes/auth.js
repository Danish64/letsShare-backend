const bcrypt = require("bcrypt");
const Joi = require("joi");
const _ = require("lodash");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const debug = require("debug")("app:db");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(200).send({
      status: "success",
      errorCode: 400,
      message: error.details[0].message,
    });

  let user;
  try {
    user = await User.findOne({ email: req.body.email });
    // debug("user object from db", user);
    if (!user)
      return res.status(200).send({
        status: "success",
        errorCode: 404,
        message: "Invalid email or password !",
      });
  } catch (er) {
    debug(er);
  }
  try {
    // debug("user before decrypting password", user);
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(200).send({
        status: "success",
        errorCode: 404,
        message: "Invalid email or password !",
      });
  } catch (er) {
    debug("In validating password block", er);
  }
  const token = user.generateAuthToken();
  res
    .status(200)
    .header("x-auth-token", token)
    .send({ status: "success", data: user, message: null });
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
}

module.exports = router;
