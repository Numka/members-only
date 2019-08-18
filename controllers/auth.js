const User = require("../models/user");

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
        if (user.password.toString() === password.toString()) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
                console.log(err);
                res.redirect('/');
            });
        } else {
            res.redirect('/login');
        }
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = new User({
    email,
    password
  });
  user
    .save()
    .then(result => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(errr);
    });
};
