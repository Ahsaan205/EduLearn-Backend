const Board = require('../models/Board');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Question = require('../models/Question');
const mongoose = require('mongoose');

const getBreadcrumbs = async (req, res) => {
  try {
    const { boardId, classId, subjectId, chapterId } = req.query;
    const breadcrumbs = {};
    if (boardId) {
      const board = await Board.findById(boardId);
      if (board) breadcrumbs.board = board.name;
    }
    if (classId) {
      const cls = await Class.findById(classId);
      if (cls) breadcrumbs.class = `${cls.gradeLevel}th Class`;
    }
    if (subjectId) {
      const subject = await Subject.findById(subjectId);
      if (subject) breadcrumbs.subject = subject.name;
    }
    if (chapterId) {
      const chapter = await Chapter.findById(chapterId);
      if (chapter) breadcrumbs.chapter = `Ch ${chapter.chapterNumber}`;
    }
    res.json(breadcrumbs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBoards = async (req, res) => {
  try {
    const boards = await Board.find();
    res.json(boards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getClassesByBoard = async (req, res) => {
  try {
    const classes = await Class.find({ boardId: req.params.boardId }).sort({ gradeLevel: 1 });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSubjectsByClass = async (req, res) => {
  try {
    const subjects = await Subject.find({ classId: req.params.classId });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getChaptersBySubject = async (req, res) => {
  try {
    const chapters = await Chapter.find({ subjectId: req.params.subjectId }).sort({ chapterNumber: 1 });
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getQuestionsByChapter = async (req, res) => {
  try {
    const questions = await Question.find({ chapterId: req.params.chapterId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const generateCustomTest = async (req, res) => {
  try {
    const { chapterIds, mcqCount, shortCount, longCount } = req.body;
    if (!chapterIds || chapterIds.length === 0) {
      return res.status(400).json({ error: 'Please select at least one chapter' });
    }

    const test = { MCQs: [], Shorts: [], Longs: [] };
    const objectIds = chapterIds.map(id => new mongoose.Types.ObjectId(id));

    const fetchRandom = async (type, count) => {
      if (count > 0) {
        return await Question.aggregate([
          { $match: { chapterId: { $in: objectIds }, type } },
          { $sample: { size: count } }
        ]);
      }
      return [];
    };

    test.MCQs = await fetchRandom('MCQ', Number(mcqCount) || 0);
    test.Shorts = await fetchRandom('Short', Number(shortCount) || 0);
    test.Longs = await fetchRandom('Long', Number(longCount) || 0);

    res.json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getBoards,
  getClassesByBoard,
  getSubjectsByClass,
  getChaptersBySubject,
  getQuestionsByChapter,
  getBreadcrumbs,
  generateCustomTest
};
