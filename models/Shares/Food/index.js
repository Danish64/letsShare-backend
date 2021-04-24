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

  availerQuantity: {
    type: Number,
    default: 1,
  },

  availerMessage: {
    type: String,
  },

  isAccepted: {
    type: Boolean,
    default: false,
  },
});

const foodShareSchema = new mongoose.Schema({
  sharerId: {
    type: mongoose.ObjectId,
    required: true,
  },
  sharerMessage: {
    type: String,
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
  ownerContactNumber: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  images: [{ type: String }],

  shareType: {
    type: String,
    required: true,
  },

  deliveryInfo: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 500,
  },
  price: {
    type: String,
    default: "Free",
  },
  listForDays: {
    type: Number,
    default: 1,
    minlength: 1,
    maxlength: 2,
  },

  pickUpLocation: {
    address: { type: String },
    latitude: { type: String },
    longitude: { type: String },
  },

  isAvailable: {
    type: Boolean,
    default: true,
  },

  pickUpTime: {
    type: String,
    required: false,
  },

  bookings: [BookingSchema],

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

exports.FoodShare = mongoose.model("FoodShare", foodShareSchema);
exports.FoodShareSchema = foodShareSchema;
