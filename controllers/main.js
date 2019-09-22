const Message = require("../models/message");

exports.getIndex = (req, res, next) => {
  //const isLogged = req.session.isLoggedIn;

  Message.find()
    .then(messages => {
      res.render("main/index", {
        path: '/',
        messages: messages.reverse(),
        tryingEjs: "200",
        user: req.user
      });
    })
    .catch(err => {
      console.log(err);
    });
};
