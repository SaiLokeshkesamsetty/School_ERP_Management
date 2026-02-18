
const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');

const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, isAdmin, examController.createExam);
router.get('/', verifyToken, examController.getAllExams); // Visible to all (or protect as needed)
router.get('/my-results', verifyToken, examController.getMyResults);
router.post('/results', verifyToken, examController.addResult); // Teacher only? Add isTeacher check if needed
router.get('/results/:studentId', verifyToken, examController.getResultsByStudent);

module.exports = router;
