const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    errorMessage: undefined
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

  User.findOne({ email: email })
    .then(user => {
      bcrypt.compare(password, user.password, (err, doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
            console.log(err);
            res.redirect("/");
          });
        } else {
          console.log(err);
          res.redirect("/login");
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
    return res.render("auth/signup", {
      path: "/signup",
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: { email, nickname, password, confirmPassword }
    });
  }
  // if (password.toString() !== confrimPassword.toString()) {
  //   console.log(validationErrors);
  //   return res.render("auth/signup", {
  //     validationErrors
  //   });
  // }

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
    console.log(err);
    res.redirect("/");
  });
};
