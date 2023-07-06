const express = require("express");
const JoinRequest = require("../Models/joinRequest");

const joinRequestRouter = express.Router();
// Endpoint to send a join request for an event
joinRequestRouter.post("/api/events/join/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if the event has reached the player limit
    if (event.participants.length >= event.playerLimit) {
      return res.status(400).json({ error: "Event is full" });
    }

    const existingRequest = await JoinRequest.findOne({
      event: eventId,
      user: userId,
    });

    if (existingRequest) {
      return res.status(400).json({ error: "Request already sent" });
    }

    const newRequest = new JoinRequest({
      user: userId,
      event: eventId,
    });

    await newRequest.save();
    res.json({ message: "Request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Endpoint to accept or reject a join request
joinRequestRouter.put(
  "/api/events/:eventId/requests/:requestId/accept",
  async (req, res) => {
    try {
      const eventId = req.params.eventId;
      const requestId = req.params.requestId;

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const request = await JoinRequest.findById(requestId);
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }

      if (request.event.toString() !== eventId) {
        return res.status(400).json({ error: "Invalid request" });
      }

      if (event.participants.length >= event.playerLimit) {
        return res.status(400).json({ error: "Event is full" });
      }

      request.status = "accepted";

      event.participants.push(request);

      await request.save();
      await event.save();

      res.json({ message: "Request accepted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Endpoint to reject a join request
joinRequestRouter.put(
  "/api/events/:eventId/requests/:requestId/reject",
  authMiddleware,
  async (req, res) => {
    try {
      const eventId = req.params.eventId;
      const requestId = req.params.requestId;

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const request = await JoinRequest.findById(requestId);
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }

      if (request.event.toString() !== eventId) {
        return res.status(400).json({ error: "Invalid request" });
      }

      // Update request status to 'rejected'
      request.status = "rejected";

      await request.save();

      res.json({ message: "Request rejected successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);
