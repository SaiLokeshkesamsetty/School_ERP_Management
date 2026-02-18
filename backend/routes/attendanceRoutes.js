
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.post('/', verifyToken, checkRole(['teacher', 'admin']), attendanceController.markAttendance);
router.get('/my-attendance', verifyToken, checkRole(['student', 'parent']), attendanceController.getMyAttendance);
router.get('/student/:studentId', verifyToken, checkRole(['teacher', 'admin']), attendanceController.getAttendanceByStudent);
router.get('/report', verifyToken, checkRole(['teacher', 'admin']), attendanceController.getAttendanceReport);

module.exports = router;
