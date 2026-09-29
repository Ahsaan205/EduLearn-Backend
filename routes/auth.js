const express = require('express');
const router = express.Router();
const { adminLogin, registerStudent, unifiedLogin, updateProfile, changePassword, googleLogin } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Admin Login
router.post('/admin/login', adminLogin);

// Student Register
router.post('/register', registerStudent);

// Unified Login (Admin & Student)
router.post('/login', unifiedLogin);

// Google Login
router.post('/google', googleLogin);

const upload = require('../middleware/upload');
// Update Profile
router.put('/profile', authMiddleware, upload.single('image'), updateProfile);
// Change Password
router.post('/change-password', authMiddleware, changePassword);
module.exports = router;
