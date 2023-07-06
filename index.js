const express = require("express");

const DbConnection = require("./server");
const userRouter = require("./Routes/user.routes");
const agenda = require("./Controller/agenda");

const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRouter);

app.get("/", (req, res) => {
  res.send("hello from sever");
});

app.listen(process.env.PORT, async () => {
  try {
    // await DbConnection;
    // console.log("db Connected");
  } catch (error) {
    console.log(error);
  }
  console.log(`Server is running `);
});

// agenda.start();
