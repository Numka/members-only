const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.getLogin = (req, res, next) => {
  res.render("auth/login");
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup");
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
  const confrimPassword = req.body.confrimPassword;

  if (password.toString() !== confrimPassword.toString()) {
    return res.redirect("/signup");
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
    console.log(err);
    res.redirect("/");
  });
};
