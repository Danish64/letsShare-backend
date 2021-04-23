const mongoose = require("mongoose");

const userFoodSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.ObjectId,
    required: true,
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

const UserFoodSchema = mongoose.model("UserFoods", userFoodSchema);

exports.UserFoodSchema = UserFoodSchema;
