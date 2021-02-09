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
// userSchema.methods.generateAuthToken = function () {
//   const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
//   return token;
// };

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    phone: Joi.string().min(11).max(13).required(),
    city: Joi.string().min(3).max(124).required(),
    avatar: Joi.binary(),
    gender: Joi.string().valid("male", "female").required(),
    homeAddress: Joi.object({
      house: Joi.string().required(),
      street: Joi.string().required(),
      province: Joi.string().required(),
    }).required(),
    workAddress: Joi.object({
      house: Joi.string().required(),
      street: Joi.string().required(),
      province: Joi.string().required(),
    }).required(),
    sharedAssets: Joi.object({
      sharedSpaces: Joi.array().items(
        Joi.object({
          spaceName: Joi.string(),
        })
      ),
      sharedRides: Joi.array().items(
        Joi.object({
          rideName: Joi.string(),
        })
      ),
      sharedFoods: Joi.array().items(
        Joi.object({
          foodName: Joi.string(),
        })
      ),
      sharedGoods: Joi.array().items(
        Joi.object({
          goodName: Joi.string(),
        })
      ),
    }),
    availedAssets: Joi.object({
      availedSpaces: Joi.array().items(
        Joi.object({
          spaceName: Joi.string(),
        })
      ),
      availedRides: Joi.array().items(
        Joi.object({
          rideName: Joi.string(),
        })
      ),
      availedFoods: Joi.array().items(
        Joi.object({
          foodName: Joi.string(),
        })
      ),
      availedGoods: Joi.array().items(
        Joi.object({
          goodName: Joi.string(),
        })
      ),
    }),
    reviews: Joi.array().items(Joi.object({ review: Joi.string() })),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
