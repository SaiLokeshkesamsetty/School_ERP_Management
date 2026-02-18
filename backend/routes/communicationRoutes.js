
const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');

router.post('/message', communicationController.sendMessage);
router.get('/messages/:userId', communicationController.getMessages);
router.post('/announcement', communicationController.createAnnouncement);
router.get('/announcements', communicationController.getAnnouncements);

module.exports = router;
