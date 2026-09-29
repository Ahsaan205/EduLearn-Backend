const Chapter = require('../models/Chapter');
const Question = require('../models/Question');
const Student = require('../models/Student');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// --- Chapter Management ---
const createChapter = async (req, res) => {
  try {
    const chapter = new Chapter(req.body);
    await chapter.save();
    res.status(201).json(chapter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(chapter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteChapter = async (req, res) => {
  try {
    await Chapter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Chapter deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// --- Question Management ---
const createQuestion = async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const createBulkQuestions = async (req, res) => {
  try {
    const questions = req.body; // Expects an array of question objects
    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: 'Expected an array of questions' });
    }
    const insertedQuestions = await Question.insertMany(questions);
    res.status(201).json(insertedQuestions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const clearChapterQuestions = async (req, res) => {
  try {
    const { type } = req.query;
    const query = { chapterId: req.params.chapterId };
    if (type) {
      query.type = type;
    }
    await Question.deleteMany(query);
    res.json({ message: type ? `All ${type} questions cleared for this chapter` : 'All questions cleared for this chapter' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// --- Student Management ---
const getStudents = async (req, res) => {
  try {
    const students = await Student.find({}, '-password').sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'edulearn_questions',
    });

    res.json({ secure_url: result.secure_url });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
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
};
