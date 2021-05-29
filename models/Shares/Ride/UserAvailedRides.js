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
    default: 1,
  },

  availerMessage: {
    type: String,
  },
  availerPickUpLocation: {
    address: { type: String },
    latitude: { type: String },
    longitude: { type: String },
  },
  availerDropOffLocation: {
    address: { type: String },
    latitude: { type: String },
    longitude: { type: String },
  },

  isAccepted: {
    type: Boolean,
    default: false,
  },
});

const userAvailedRideSchema = new mongoose.Schema({
  sharerId: {
    type: mongoose.ObjectId,
    required: true,
  },
  availerId: {
    type: mongoose.ObjectId,
    required: true,
  },
  shareId: {
    type: mongoose.ObjectId,
    required: true,
  },
  sharerMessage: {
    type: String,
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
    minlength: 2,
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

  rideCategory: {
    type: String,
    required: true,
  },
  startLocation: {
    address: { type: String },
    latitude: { type: String },
    longitude: { type: String },
  },
  destinationLocation: {
    address: { type: String },
    latitude: { type: String },
    longitude: { type: String },
  },
  departureDate: {
    type: String,
  },
  returnDate: {
    type: String,
  },
  departureTime: {
    type: String,
  },
  tourInfo: {
    type: String,
  },
  tourDays: {
    type: String,
  },

  routeInfo: {
    type: String,
  },
  fareMethod: {
    type: String,
  },
  fareRate: {
    type: Number,
  },
  seatsAvailable: {
    type: Number,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },

  departureTime: {
    type: String,
    required: false,
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

const UserAvailedRides = mongoose.model(
  "UserAvailedRides",
  userAvailedRideSchema
);

exports.UserAvailedRides = UserAvailedRides;
