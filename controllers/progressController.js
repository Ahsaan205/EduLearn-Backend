const Progress = require('../models/Progress');

const getStudentProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ studentId: req.user.id }).populate('chapterId');
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { chapterId, mcqScore, totalQuestions, status } = req.body;
    
    const progress = await Progress.findOneAndUpdate(
      { studentId: req.user.id, chapterId },
      { mcqScore, totalQuestions, status },
      { new: true, upsert: true }
    );
    
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getStudentProgress,
  updateProgress
};
