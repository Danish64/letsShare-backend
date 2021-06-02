const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  availerId: {
    type: mongoose.ObjectId,
    required: true,
  },
  availerName: {
    type: String,
  },
  availerAddress: {
    type: String,
  },
  availerPhoneNumber: {
    type: String,
  },

  availerRooms: {
    type: Number,
  },
  availerBeds: {
    type: Number,
  },
  isAvailingWhole: {
    type: Boolean,
    default: false,
  },
  availerMessage: {
    type: String,
  },

  isAccepted: {
    type: Boolean,
    default: false,
  },
});

const userAvailedSpacesSchema = new mongoose.Schema({
  sharerId: {
    type: mongoose.ObjectId,
    required: true,
  },
  sharerMessage: {
    type: String,
  },
  availerId: {
    type: mongoose.ObjectId,
    required: true,
  },
  shareId: {
    type: mongoose.ObjectId,
    required: true,
  },
  spaceTitle: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  spaceType: {
    type: String,
    required: true,
  },
  spaceLocation: {
    address: { type: String },
    latitude: { type: String },
    longitude: { type: String },
  },
  spacePictures: [{ type: String }],
  amenity: [{ type: String }],
  spaceSpecifications: { type: String, required: true },
  spaceDescription: { type: String },
  ownerContactNumber: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },

  spaceCategory: {
    type: String,
    required: true,
    default: "Residence",
  },

  singleShareAbleUnit: {
    type: String,
    enum: ["room", "bed", "house"],
  },

  roomsAvailable: {
    type: Number,
  },
  roomFare: {
    type: String,
  },
  bedsAvailable: {
    type: Number,
  },
  bedFare: {
    type: String,
  },
  houseFare: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },

  isCompleted: {
    type: Boolean,
    default: false,
  },

  bookings: [BookingSchema],

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const UserAvailedSpaces = mongoose.model(
  "UserAvailedSpaces",
  userAvailedSpacesSchema
);

exports.UserAvailedSpaces = UserAvailedSpaces;
exports.UserAvailedSpacesSchema = userAvailedSpacesSchema;
