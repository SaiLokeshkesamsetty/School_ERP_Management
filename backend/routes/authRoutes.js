
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Admin Routes
router.get('/users', verifyToken, isAdmin, authController.getAllUsers);
router.put('/users/:id', verifyToken, isAdmin, authController.updateUser);
router.delete('/users/:id', verifyToken, isAdmin, authController.deleteUser);

module.exports = router;
