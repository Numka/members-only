const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require('express-session');
const mongoDBstore = require('connect-mongodb-session')(session);

//routes
const mainRoutes = require("./routes/main");
const messageRoutes = require("./routes/message");

//database access URI
const MONGODB_URI =
  "mongodb+srv://numinor:toTheStars819@cluster0-8dfz5.mongodb.net/members?retryWrites=true&w=majority";

//initialize app
const app = express();
const store = new mongoDBstore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

app.set("view engine", "ejs");

//parser BEFORE routes use
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'secret car',
  resave: false,
  saveUninitialized: false,
  store: store
}))

app.use((req,res,next) => {
  req.session.myValue = "myValue";
  console.log(req.session);
  next();
})

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
