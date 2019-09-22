// dependencies
const dotenv = require('dotenv').config();
const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoDBstore = require("connect-mongodb-session")(session);

const User = require("./models/user");

//routes
const mainRoutes = require("./routes/main");
const messageRoutes = require("./routes/message");
const authRoutes = require("./routes/auth");

//initialize app
const app = express();
const store = new mongoDBstore({
  uri: process.env.MONGODB_URI,
  collection: "sessions"
});

//view engine
app.set("view engine", "ejs");

//parser BEFORE routes use
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret car",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

//populate session with user data
app.use((req, res, next) => {
  if (!req.session.user) {
    next();
  } else {
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => {
        console.log(err);
      });
  }
});

//set up locals for render function
app.use((req, res, next) => {
  res.locals.isLogged = req.session.isLoggedIn
  //console.log(req.session);
  next();
});

//routes use
app.use(mainRoutes);
app.use(messageRoutes);
app.use(authRoutes);

//database + starting to listen
const port = process.env.PORT || 3000
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(result => {
    console.log("CONNECTED");
    app.listen(port, () => console.log(`app started and listens on port ${port}`));
  })
  .catch(err => {
    console.log(err);
  });
