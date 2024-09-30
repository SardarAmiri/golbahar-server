const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    organizer: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postcode: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    media: {
      type: Array,
      required: true,
      default: [],
    },
    ticketTypes: {
      type: Array,
      required: false,
      default: [],
    },
  },
  { timestamps: true }
);

const EventModel = mongoose.model("events", eventSchema);

module.exports = EventModel;
