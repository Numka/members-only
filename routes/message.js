const express = require('express');

const router = express.Router();

const messageController = require('../controllers/message')

router.get('/add-message', messageController.getAddMessage);

router.post('/add-message', messageController.postAddMessage);

module.exports = router;