const mongoose = require("mongoose");

const userSpaceSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.ObjectId,
    required: true,
  },
  spaceTitle: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  spaceLocation: {
    address: { type: String },
    latitude: { type: String },
    longitude: { type: String },
  },
  spaceType: {
    type: String,
    required: true,
  },
  ownerContactNumber: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  spacePictures: [{ type: String }],
  amenity: [{ type: String }],
  spaceSpecifications: { type: String, required: true },
  spaceDescription: { type: String },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const UserSpaceSchema = mongoose.model("UserSpaces", userSpaceSchema);

exports.UserSpaceSchema = UserSpaceSchema;
