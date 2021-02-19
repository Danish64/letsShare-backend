const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  phone: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 13,
  },
  city: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 124,
  },
  avatar: {
    data: Buffer,
    contentType: String,
    required: false,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },

  birthDate: {
    type: Date,
  },

  homeAddress: {
    house: String,
    street: String,
    province: String,
  },
  workAddress: {
    house: String,
    street: String,
    province: String,
  },

  joinedDate: {
    type: Date,
    default: Date.now,
  },

  sharedAssets: {
    sharedSpaces: [{ spaceName: String }],
    sharedRides: [{ rideName: String }],
    sharedFoods: [{ foodName: String }],
    sharedGoods: [{ goodName: String }],
  },

  availedAssets: {
    availedSpaces: [{ spaceName: String }],
    availedRides: [{ rideName: String }],
    availedFoods: [{ foodName: String }],
    availedGoods: [{ goodName: String }],
  },

  reviews: [{ review: String }],
});
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    phone: Joi.string().min(11).max(13).required(),
    city: Joi.string().min(3).max(124).required(),
    gender: Joi.string().valid("male", "female").required(),
  });

  return schema.validate(user);
}

function validateEmailPassword(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user);
}

function validateEmail(email) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
  });

  return schema.validate(email);
}

exports.User = User;
exports.validate = validateUser;
exports.validateEmail = validateEmail;
exports.validateEmailPassword = validateEmailPassword;
