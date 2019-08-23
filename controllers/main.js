const Message = require("../models/message");

exports.getIndex = (req, res, next) => {
  //const isLogged = req.session.isLoggedIn;

  Message.find()
    .then(messages => {
      res.render("main/index", {
        path: '/',
        messages,
        tryingEjs: "200"
      });
    })
    .catch(err => {
      console.log(err);
    });
};
