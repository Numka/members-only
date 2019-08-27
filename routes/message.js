const express = require('express');

//my middleware
const isAuth = require('../middleware/isAuth');

const router = express.Router();

const messageController = require('../controllers/message')

router.get('/add-message', isAuth, messageController.getAddMessage);

router.post('/add-message', isAuth, messageController.postAddMessage);

router.post('/delete-message/:messageId', isAuth, messageController.postDeleteMessage)

module.exports = router;