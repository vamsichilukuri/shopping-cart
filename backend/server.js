const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/shop";

const api = require("./routes/api");

const app = express();
app.use(cors());

app.use(bodyParser.json());

app.use("/api", api);

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const con = mongoose.connection;

con.on("open", () => {
  console.log("Connected..");
});

app.get("/", (req, res) => {
  res.send("We got the req");
});

app.listen(3000, () => console.log("Your Server is listening at 3000"));
