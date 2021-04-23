const mongoose = require("mongoose");

const userGoodSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.ObjectId,
    required: true,
  },
  ownerContactNumber: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 2000,
  },
  quantity: {
    type: Number,
    required: true,
  },
  images: [{ type: String }],

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const UserGoodSchema = mongoose.model("UserGoods", userGoodSchema);

exports.UserGoodSchema = UserGoodSchema;
