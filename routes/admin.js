const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {
  createChapter,
  updateChapter,
  deleteChapter,
  createQuestion,
  createBulkQuestions,
  updateQuestion,
  deleteQuestion,
  clearChapterQuestions,
  getStudents,
  deleteStudent,
  uploadImage
} = require('../controllers/adminController');

router.use(authMiddleware, adminMiddleware);

// --- Upload Route ---
router.post('/upload-image', upload.single('file'), uploadImage);

// --- Chapter Management ---
router.post('/chapters', createChapter);
router.put('/chapters/:id', updateChapter);
router.delete('/chapters/:id', deleteChapter);

// --- Question Management ---
router.post('/questions', createQuestion);
router.post('/questions/bulk', createBulkQuestions);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);
router.delete('/chapters/:chapterId/questions', clearChapterQuestions);

// --- Student Management ---
router.get('/students', getStudents);
router.delete('/students/:id', deleteStudent);

module.exports = router;
