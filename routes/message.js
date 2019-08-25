const express = require('express');

//my middleware
const isAuth = require('../middleware/isAuth');

const router = express.Router();

const messageController = require('../controllers/message')

router.get('/add-message', isAuth, messageController.getAddMessage);

router.post('/add-message', isAuth, messageController.postAddMessage);

module.exports = router;