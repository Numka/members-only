// Controller for:
// authentication flow
// - sign up
// - login / logout
// - reset password

const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const crypto = require("crypto");

//mailing
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({ auth: { api_key: process.env.SENDGRID_API_KEY } })
);

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    errorMessage: undefined,
    oldInput: { email: "", password: "" }
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    errorMessage: undefined,
    oldInput: { email: "", nickname: "", password: "", confirmPassword: "" }
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  User.findOne({ email: email })
    .then(user => {
      bcrypt.compare(password, user.password, (err, doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
            //console.log(err);
            res.redirect("/");
          });
        } else {
          console.log(err);
          res.status(422).render("auth/login", {
            path: "/login",
            errorMessage: "Wrond email or password!",
            oldInput: { email, password }
          });
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const nickname = req.body.nickname;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render("auth/signup", {
      path: "/signup",
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: { email, nickname, password, confirmPassword }
    });
  }

  bcrypt.hash(password, 12, (err, hashedPassword) => {
    const user = new User({
      email,
      nickname,
      password: hashedPassword
    });
    return user
      .save()
      .then(result => {
        res.redirect("/");
      })
      .catch(err => {
        console.log(err);
      });
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset",
    errorMessage: ""
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;

  // generate random hex to identify user that wants reset
  crypto.randomBytes(32, (err, buffer) => {
    const token = buffer.toString("hex");
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          res.status(422).render("auth/reset", {
            path: "/reset",
            errorMessage: "There is no user with such email!"
          });
        }
        user.resetToken = token;
        user.resetTokenExpires = Date.now() + 3600000;
        console.log(user);
        console.log(user.resetToken);
        console.log(token);
        return user.save();
      })
      .then(result => {
        res.redirect("/");
        transporter.sendMail({
          to: email,
          from: "reset-pwd@members-only.com",
          subject: "Password reset",
          html: `<p>Your password reset link: <a href="http://localhost:3000/new-password/${token}">Reset</a> </p>
        <p>Ignore this if you didn't request password reset.</p>`
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  console.log(token);

  User.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() }
  })
    .then(user => {
      console.log(user);
      console.log(user._id);
      if (!user) {
        res.render("auth/new-password", {
          path: "/new-password",
          errorMessage: "invalid or expired token",
          resetToken: token,
          id: ""
        });
      }
      res.render("auth/new-password", {
        path: "/new-password",
        errorMessage: "",
        resetToken: token,
        id: user._id
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const token = req.body.resetToken;
  const id = req.body.id;

  User.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() },
    _id: id
  })
    .then(user => {
      console.log(user);
      console.log("success");
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
    });
};
