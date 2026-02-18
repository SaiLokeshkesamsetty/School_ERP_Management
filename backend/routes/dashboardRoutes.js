const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.get('/teacher', verifyToken, checkRole(['teacher', 'admin']), dashboardController.getTeacherDashboardStats);
router.get('/student', verifyToken, checkRole(['student']), dashboardController.getStudentDashboardStats);
router.get('/parent', verifyToken, checkRole(['parent']), dashboardController.getParentDashboardStats);

module.exports = router;
