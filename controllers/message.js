const Message = require("../models/message");

exports.getAddMessage = (req, res, next) => {
  res.render("message/add-message", {
    path: "/add-message"
  });
};

exports.postAddMessage = (req, res, next) => {
  const nickname = req.user.nickname;
  const msgText = req.body.msgtext;

  const message = new Message({
    nickname,
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

exports.postDeleteMessage = (req, res, next) => {
  const messageId = req.params.messageId.slice(1);

  Message.findByIdAndDelete(messageId)
    .then(message => {
      //console.log(message);
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    });
};

// req.user -> take nickname -> assign this id to the message
