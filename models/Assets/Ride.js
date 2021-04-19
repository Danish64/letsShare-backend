const mongoose = require("mongoose");

const userRideSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.ObjectId,
    required: true,
  },
  rideName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  registrationNumber: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  rideType: {
    type: String,
    required: true,
  },
  ownerContactNumber: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  ridePictures: [{ type: String }],

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const UserRideSchema = mongoose.model("UserRides", userRideSchema);

exports.UserRideSchema = UserRideSchema;
