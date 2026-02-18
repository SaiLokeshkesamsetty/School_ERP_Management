const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, checkRole(['admin', 'teacher']), classController.getAllClasses);
router.get('/:classId/timetable', verifyToken, classController.getTimetableByClass);
router.post('/timetable', verifyToken, checkRole(['admin']), classController.addTimetableEntry);
router.delete('/timetable/:entryId', verifyToken, checkRole(['admin']), classController.deleteTimetableEntry);

module.exports = router;
