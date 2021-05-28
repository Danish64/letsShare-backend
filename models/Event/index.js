const mongoose = require("mongoose");

const SharingSchema = new mongoose.Schema({
  sharerName: String,
  sharerContact: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  shareType: String,
  shareTitle: String,
  shareDescription: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 5000,
  },
  shareCapacityDescription: String,
});

const eventSchema = new mongoose.Schema({
  managerId: {
    type: mongoose.ObjectId,
    required: true,
  },
  managerName: String,
  managerContact: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  eventTitle: String,
  eventDescription: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 5000,
  },
  eventLocation: {
    address: { type: String },
    latitude: { type: String },
    longitude: { type: String },
  },
  isOneDay: Boolean,
  eventStartDate: String,
  eventEndDate: String,
  eventDuration: String,
  sharings: [SharingSchema],
  eventPictures: [String],
  isEnded: {
    type: Boolean,
    default: false,
  },
});

const Event = mongoose.model("Event", eventSchema);

exports.Event = Event;
exports.EventSchema = eventSchema;
