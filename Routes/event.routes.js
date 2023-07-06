const express = require("express");
const Event = require("../Models/Event");

const eventRouter = express.Router();

// Endpoint to create a new event

eventRouter.post("/", async (req, res) => {
  try {
    const { description, timings, playerLimit, additionalRequirements } =
      req.body;

    // Create a new event document
    const newEvent = new Event({
      description,
      timings,
      playerLimit,
      additionalRequirements,
      organizer: req.userId,
    });

    // Save the new event to the database
    await newEvent.save();

    res.status(201).json({ message: "Event created successfully" });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to fetch a list of available events with search and filter options
router.get("/api/events", async (req, res) => {
  try {
    const { search, sortBy } = req.query;

    const query = {
      $where: "this.participants.length < this.playerLimit",
    };

    if (search) {
      query.description = { $regex: search, $options: "i" };
    }

    let events = await Event.find(query)
      .populate("organizer", "username")
      .sort(
        sortBy === "date"
          ? { timings: 1 }
          : sortBy === "participants"
          ? { participants: 1 }
          : {}
      )
      .exec();

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
