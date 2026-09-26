const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getStudentProgress, updateProgress } = require('../controllers/progressController');

router.use(authMiddleware);

// Get student progress
router.get('/', getStudentProgress);

// Update or create progress for a chapter
router.post('/update', updateProgress);

module.exports = router;
