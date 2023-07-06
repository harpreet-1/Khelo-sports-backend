const Agenda = require("agenda");
const mongoose = require("mongoose");
const Event = require("../Models/Event");
const joinRequest = require("../Models/joinRequest");

// Establish the MongoDB connection
require("dotenv").config();
mongoose
  .connect(process.env.MONGO_DB, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("sever is started in agenda");
  });

// Create an instance of Agenda using the established connection
const agenda = new Agenda({ mongo: mongoose.connection });

agenda.define("expirePendingRequests", async (job) => {
  try {
    // Get the current date and time
    const currentDate = new Date();

    // Find pending requests associated with events that have already started
    const expiredRequests = await joinRequest.find({
      status: "pending",
      event: {
        $in: await Event.find({ timings: { $lt: currentDate } }).distinct(
          "_id"
        ),
      },
    });

    // Update the status of expired requests to 'rejected'
    await Promise.all(
      expiredRequests.map(async (request) => {
        request.status = "rejected";
        await request.save();
      })
    );

    console.log("Job for expiring pending requests executed");
  } catch (error) {
    console.error("Error executing job for expiring pending requests:", error);
  }
});
// Schedule the job to run every 5 minutes
agenda.every("5 minutes", "expirePendingRequests");
(async () => {
  await agenda.start();
})();

module.exports = agenda;
