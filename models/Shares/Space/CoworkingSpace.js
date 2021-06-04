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
  availerSeats: {
    type: Number,
  },
  availerDesks: {
    type: Number,
  },
  availerRooms: {
    type: Number,
  },
  availerMessage: {
    type: String,
  },

  bookingStatus: {
    type: String,
    default: "Pending",
  },

  isAccepted: {
    type: Boolean,
    default: false,
  },
});

const workingSpaceShareSchema = new mongoose.Schema({
  sharerId: {
    type: mongoose.ObjectId,
    required: true,
  },
  sharerMessage: {
    type: String,
  },
  spaceTitle: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  spaceType: {
    type: String,
    default: "Working",
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
    default: "Working",
  },

  singleShareAbleUnit: {
    type: String,
    enum: ["room", "bed", "house"],
  },

  seatsAvailable: Number,
  seatFare: Number,
  desksAvailable: Number,
  deskFare: Number,
  roomsAvailable: Number,
  roomFare: Number,

  isAvailable: {
    type: Boolean,
    default: true,
  },

  bookings: [BookingSchema],

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const WorkingSpaceShare = mongoose.model(
  "WorkingSpaceShare",
  workingSpaceShareSchema
);

exports.WorkingSpaceShare = WorkingSpaceShare;
