
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, checkRole(['admin', 'teacher']), studentController.getAllStudents);
router.get('/my-timetable', verifyToken, checkRole(['student']), studentController.getMyTimetable);
router.get('/:id', verifyToken, checkRole(['admin', 'teacher']), studentController.getStudentById);
router.post('/', verifyToken, checkRole(['admin']), studentController.addStudent);
router.put('/:id', verifyToken, checkRole(['admin']), studentController.updateStudent);
router.delete('/:id', verifyToken, checkRole(['admin']), studentController.deleteStudent);

module.exports = router;
