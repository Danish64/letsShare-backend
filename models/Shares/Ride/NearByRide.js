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

const nearByRideShareSchema = new mongoose.Schema({
  sharerId: {
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

  rideCategory: {
    type: String,
    required: true,
    default: "Nearby",
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
  fare: {
    type: String,
  },
  seatsAvailable: {
    type: Number,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  // departureDate: {
  //   type: Date,
  //   required: true,
  // },
  departureTime: {
    type: String,
    required: true,
  },

  bookings: [BookingSchema],

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const NearByRideShare = mongoose.model(
  "NearByRideShare",
  nearByRideShareSchema
);

exports.NearByRideShare = NearByRideShare;
