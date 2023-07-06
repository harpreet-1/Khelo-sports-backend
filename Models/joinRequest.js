const mongoose = require("mongoose");

const JoinRequestSchema = new mongoose.Schema({
  user: {
    type: String,
    ref: "User",
    required: true,
  },
  event: {
    type: String,
    ref: "Event",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

const joinRequest = mongoose.model("JoinRequest", JoinRequestSchema);

module.exports = joinRequest;
