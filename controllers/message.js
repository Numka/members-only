const Message = require("../models/message");

exports.getAddMessage = (req, res, next) => {
  res.render("message/add-message");
};

exports.postAddMessage = (req, res, next) => {
  console.log(req.body);
  const msgText = req.body.msgtext;

  const message = new Message({
    msgText
  });
  message
    .save()
    .then(result => {
      //console.log(result);
      console.log("ADDED MSG");
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
    });
};
