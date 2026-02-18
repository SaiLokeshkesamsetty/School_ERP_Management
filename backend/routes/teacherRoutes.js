
const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', teacherController.getAllTeachers);
router.get('/my-timetable', verifyToken, teacherController.getMyTimetable);
router.post('/', teacherController.addTeacher);
router.put('/:id', teacherController.updateTeacher);
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;
