const Message = require("../models/message");

exports.getIndex = (req, res, next) => {
  const isLogged = req.session.isLoggedIn;

  Message.find()
    .then(messages => {
      res.render("main/index", {
        messages,
        tryingEjs: "200",
        isLogged
      });
    })
    .catch(err => {
      console.log(err);
    });
};
