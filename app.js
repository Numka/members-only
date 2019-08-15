const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//routes
const mainRoutes = require("./routes/main");
const messageRoutes = require("./routes/message");

//database access URI
const MONGODB_URI =
  "mongodb+srv://numinor:toTheStars819@cluster0-8dfz5.mongodb.net/members?retryWrites=true&w=majority";

//initialize app
const app = express();

app.set("view engine", "ejs");

//parser BEFORE routes use
app.use(bodyParser.urlencoded({ extended: false }));

//routes use
app.use(mainRoutes);
app.use(messageRoutes);

//database + starting to listen
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(result => {
    console.log("CONNECTED");
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
