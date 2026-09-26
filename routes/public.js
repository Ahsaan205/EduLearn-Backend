const express = require('express');
const router = express.Router();
const {
  getBoards,
  getClassesByBoard,
  getSubjectsByClass,
  getChaptersBySubject,
  getQuestionsByChapter,
  getBreadcrumbs,
  generateCustomTest
} = require('../controllers/publicController');

// Get breadcrumbs
router.get('/breadcrumbs', getBreadcrumbs);

// Get all boards
router.get('/boards', getBoards);
// Get classes by board
router.get('/boards/:boardId/classes', getClassesByBoard);
// Get subjects by class
router.get('/classes/:classId/subjects', getSubjectsByClass);
// Get chapters by subject
router.get('/subjects/:subjectId/chapters', getChaptersBySubject);
// Get questions by chapter
router.get('/chapters/:chapterId/questions', getQuestionsByChapter);

// Generate custom test
router.post('/generate-test', generateCustomTest);

module.exports = router;