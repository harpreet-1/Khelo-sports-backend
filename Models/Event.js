const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  timings: {
    type: Date,
    required: true,
  },
  playerLimit: {
    type: Number,
    required: true,
  },
  additionalRequirements: {
    type: String,
    required: false,
  },
  organizer: {
    type: String,
    ref: "User",
    required: true,
  },
  participants: [
    {
      type: String,
      ref: "User",
    },
  ],
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
